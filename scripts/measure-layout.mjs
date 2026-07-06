import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const chromePath = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseUrl = process.argv[2] || 'http://127.0.0.1:5174'
const port = Number(process.env.CDP_PORT || 9333)
const userDataDir = resolve('.tmp/chrome-layout-check')
const paths = ['/', '/login', '/register', '/factory/settings', '/specialist/settings']
const viewports = [
  [1366, 900],
  [1280, 800],
  [1024, 800],
  [768, 800],
  [390, 844],
]

const sessionByPath = (path) => ({
  id: path.startsWith('/specialist') ? 2 : 1,
  role: path.startsWith('/specialist') ? 'specialist' : 'factory',
  fullName: path.startsWith('/specialist') ? 'متخصص تست' : 'کارخانه تست',
  company: 'کارخانه تست',
  identifier: '09120000000',
})

await mkdir(userDataDir, { recursive: true })

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
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

async function openPage() {
  const target = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' }).then((res) => res.json())
  return connect(target.webSocketDebuggerUrl)
}

function evaluationScript(path) {
  return `
    (() => {
      localStorage.setItem('auth_session', ${JSON.stringify(JSON.stringify(sessionByPath(path)))});
      const done = new Promise((resolve) => {
        window.__layoutDone = resolve;
        location.href = ${JSON.stringify(`${baseUrl}${path}`)};
      });
      return done;
    })()
  `
}

function measureScript() {
  return `
    (() => {
      const doc = document.documentElement;
      const body = document.body;
      const offenders = [];
      document.querySelectorAll('*').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        if (rect.left < -0.5 || rect.right > window.innerWidth + 0.5) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            className: String(el.className || '').slice(0, 100),
            left: Math.round(rect.left * 10) / 10,
            right: Math.round(rect.right * 10) / 10,
            width: Math.round(rect.width * 10) / 10,
          });
        }
      });
      const main = document.querySelector('.dash-main')?.getBoundingClientRect();
      const page = document.querySelector('.dash-page, .container')?.getBoundingClientRect();
      return {
        href: location.href,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        bodyScrollWidth: body.scrollWidth,
        overflow: doc.scrollWidth - doc.clientWidth,
        main: main && { left: Math.round(main.left), right: Math.round(main.right), width: Math.round(main.width) },
        page: page && { left: Math.round(page.left), right: Math.round(page.right), width: Math.round(page.width) },
        offenders: offenders.slice(0, 8),
      };
    })()
  `
}

const results = []

try {
  await waitForJson(`http://127.0.0.1:${port}/json/version`)

  for (const [width, height] of viewports) {
    const tab = await openPage()
    await tab.send('Page.enable')
    await tab.send('Runtime.enable')
    await tab.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600,
    })

    for (const path of paths) {
      await tab.send('Runtime.evaluate', { expression: evaluationScript(path), awaitPromise: true })
      await delay(700)
      const measured = await tab.send('Runtime.evaluate', {
        expression: measureScript(),
        awaitPromise: true,
        returnByValue: true,
      })
      const value = measured.result.value
      if (value.overflow !== 0 || value.offenders.length > 0) {
        results.push({ width, path, ...value })
      }
    }

    tab.close()
  }
} finally {
  chrome.kill()
}

console.log(JSON.stringify(results, null, 2))
