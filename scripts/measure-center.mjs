import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.argv[2] || 'http://127.0.0.1:5174'
const port = Number(process.env.CDP_PORT || 9334)
const userDataDir = resolve('.tmp/chrome-center-check')

await mkdir(userDataDir, { recursive: true })

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-first-run',
  'about:blank',
], { stdio: 'ignore' })

const delay = (ms) => new Promise((resolveDelay) => setTimeout(resolveDelay, ms))

async function waitForJson(url, retries = 50) {
  for (let i = 0; i < retries; i += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return response.json()
    } catch {
      await delay(100)
    }
  }
  throw new Error(`CDP endpoint did not respond: ${url}`)
}

function connect(wsUrl) {
  return new Promise((resolveConnect, reject) => {
    const ws = new WebSocket(wsUrl)
    const pending = new Map()
    let id = 0

    ws.addEventListener('open', () => {
      resolveConnect({
        send(method, params = {}) {
          id += 1
          ws.send(JSON.stringify({ id, method, params }))
          return new Promise((resolveSend, rejectSend) => {
            pending.set(id, { resolveSend, rejectSend })
          })
        },
        close: () => ws.close(),
      })
    })

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      if (!message.id || !pending.has(message.id)) return
      const request = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) request.rejectSend(new Error(message.error.message))
      else request.resolveSend(message.result)
    })

    ws.addEventListener('error', reject)
  })
}

const measureScript = `
(() => {
  const vw = window.innerWidth;
  const checks = [];
  const sel = ['.container', '.header', '.hero', '.auth-panel', '.auth-page', '.dash-main', '.dash-page', '#root', 'body', 'html'];
  for (const s of sel) {
    const el = document.querySelector(s);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    checks.push({
      sel: s,
      left: Math.round(r.left * 10) / 10,
      right: Math.round(r.right * 10) / 10,
      width: Math.round(r.width * 10) / 10,
      centerOffset: Math.round((r.left + r.width / 2 - vw / 2) * 10) / 10,
      marginInline: cs.marginInline,
      paddingInline: cs.paddingInlineStart + ' / ' + cs.paddingInlineEnd,
      dir: cs.direction,
      overflowX: cs.overflowX,
    });
  }
  const offenders = [];
  document.querySelectorAll('*').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    if (rect.left < -1 || rect.right > vw + 1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        className: String(el.className || '').slice(0, 80),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      });
    }
  });
  return {
    vw,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    htmlDir: document.documentElement.dir,
    checks,
    offenders: offenders.slice(0, 12),
  };
})()
`

const pages = [
  { path: '/', setup: null },
  { path: '/login', setup: null },
  {
    path: '/factory/settings',
    setup: "localStorage.setItem('auth_session', JSON.stringify({id:1,role:'factory',fullName:'Test',company:'Test',identifier:'0912'}));",
  },
]

try {
  await waitForJson(`http://127.0.0.1:${port}/json/version`)
  const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then((res) => res.json())
  const tab = await connect(target.webSocketDebuggerUrl)
  await tab.send('Page.enable')
  await tab.send('Runtime.enable')
  await tab.send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })

  for (const page of pages) {
    const setup = page.setup ? `${page.setup} ` : ''
    await tab.send('Runtime.evaluate', {
      expression: `${setup}location.href = ${JSON.stringify(`${baseUrl}${page.path}`)};`,
      awaitPromise: true,
    })
    await delay(900)
    const measured = await tab.send('Runtime.evaluate', {
      expression: measureScript,
      returnByValue: true,
    })
    console.log(JSON.stringify({ path: page.path, ...measured.result.value }, null, 2))
    console.log('---')
  }

  tab.close()
} finally {
  chrome.kill()
}
