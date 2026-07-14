import { readFileSync, writeFileSync, existsSync, watchFile } from 'node:fs'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { Eta } from 'eta'
import { Low } from 'lowdb'
import { DataFile, JSONFile } from 'lowdb/node'
import { json } from 'milliparsec'
import sirv from 'sirv'
import { parseWhere } from 'json-server/lib/parse-where.js'
import { isItem, Service } from 'json-server/lib/service.js'
import { NormalizedAdapter } from 'json-server/lib/adapters/normalized-adapter.js'
import { Observer } from 'json-server/lib/adapters/observer.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isProduction = process.env['NODE_ENV'] === 'production'
const PORT = parseInt(process.env['PORT'] || '3001')
const HOST = process.env['HOST'] || 'localhost'
const DB_FILE = process.argv[2] || 'db.json'

const eta = new Eta({ views: join(__dirname, 'node_modules/json-server/views'), cache: isProduction })
const RESERVED_QUERY_KEYS = new Set(['_sort', '_page', '_per_page', '_embed', '_where'])

function parseListParams(req) {
  const qs = req.url.split('?')[1] ?? ''
  const params = new URLSearchParams(qs)
  const f = new URLSearchParams()
  for (const [k, v] of params.entries()) { if (!RESERVED_QUERY_KEYS.has(k)) f.append(k, v) }
  let where = parseWhere(f.toString())
  const raw = params.get('_where')
  if (typeof raw === 'string') { try { const p = JSON.parse(raw); if (typeof p === 'object' && p !== null) where = p } catch {} }
  const pR = params.get('_page'); const pP = params.get('_per_page')
  return { where, sort: params.get('_sort'), page: pR ? Number(pR) : undefined, perPage: pP ? Number(pP) : undefined, embed: req.query?.['_embed'] }
}

function withBody(action) { return async (req, res, next) => { if (!isItem(req.body)) { res.status(400).json({ error: 'Body must be a JSON object' }); return }; res.locals['data'] = await action(req.params.name, req.body); next?.() } }
function withIdAndBody(action) { return async (req, res, next) => { if (!isItem(req.body)) { res.status(400).json({ error: 'Body must be a JSON object' }); return }; res.locals['data'] = await action(req.params.name, req.params.id, req.body); next?.() } }

// DB setup
if (!existsSync(DB_FILE)) writeFileSync(DB_FILE, '{}')
if (readFileSync(DB_FILE, 'utf-8').trim() === '') writeFileSync(DB_FILE, '{}')
const adapter = extname(DB_FILE) === '.json5' ? new DataFile(DB_FILE, { parse: JSON5.parse, stringify: JSON5.stringify }) : new JSONFile(DB_FILE)
const db = new Low(new Observer(new NormalizedAdapter(adapter)), {}); await db.read()
const service = new Service(db)

// App
const app = new App()
app.use(sirv('public', { dev: !isProduction }))
app.use((req, res, next) => cors({ allowedHeaders: req.headers['access-control-request-headers']?.split(',').map(h => h.trim()) })(req, res, next)).options('*', cors())
app.use(json({ payloadLimit: 10 * 1024 * 1024 })) // 10MB limit

app.get('/', (_req, res) => res.send(eta.render('index.html', { data: db.data })))
app.get('/:name', (req, res, next) => { res.locals['data'] = service.find(req.params.name, parseListParams(req)); next?.() })
app.get('/:name/:id', (req, res, next) => { res.locals['data'] = service.findById(req.params.name, req.params.id, req.query); next?.() })
app.post('/:name', withBody(service.create.bind(service)))
app.put('/:name', withBody(service.update.bind(service)))
app.put('/:name/:id', withIdAndBody(service.updateById.bind(service)))
app.patch('/:name', withBody(service.patch.bind(service)))
app.patch('/:name/:id', withIdAndBody(service.patchById.bind(service)))
app.delete('/:name/:id', async (req, res, next) => { res.locals['data'] = await service.destroyById(req.params.name, req.params.id, req.query['_dependent']); next?.() })
app.use('/:name', (req, res) => { if (res.locals['data'] === undefined) res.status(404).json({ error: 'Not Found' }); else { if (req.method === 'POST') res.status(201); res.json(res.locals['data']) } })

// Listen with port conflict handling
const srv = app.listen(PORT, () => {
  console.log(`\nJSON Server started on http://${HOST}:${PORT}`)
  console.log(`  Body limit: 10MB`)
  console.log(`  Database: ${DB_FILE}\n`)
})
srv.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use.`)
    console.error(`Run the following command to free the port:\n`)
    console.error(`  netstat -ano | findstr :${PORT}`)
    console.error(`  taskkill /PID <PID> /F\n`)
    process.exit(1)
  }
  throw err
})

// Watch db file for changes
watchFile(DB_FILE, () => db.read().catch(() => {}))
