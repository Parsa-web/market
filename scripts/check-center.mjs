import { chromium } from 'playwright'

const baseUrl = process.argv[2] || 'http://localhost:5174'
const mockSession = {
  id: 1,
  role: 'factory',
  fullName: 'کارخانه تست',
  company: 'کارخانه تست',
  identifier: '09120000000',
}

function measure(page) {
  return page.evaluate(() => {
    const vw = window.innerWidth
    const pick = (sel) => {
      const el = document.querySelector(sel)
      if (!el) return null
      const r = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        centerOffset: Math.round(r.left + r.width / 2 - vw / 2),
        paddingInline: `${cs.paddingInlineStart}/${cs.paddingInlineEnd}`,
        marginInline: cs.marginInline,
      }
    }
    return {
      vw,
      dir: document.documentElement.dir,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollX: window.scrollX,
      html: pick('html'),
      body: pick('body'),
      root: pick('#root'),
      container: pick('.container'),
      header: pick('.header'),
      dashMain: pick('.dash-main'),
      dashPage: pick('.dash-page'),
      authPanel: pick('.auth-panel'),
    }
  })
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
await page.addInitScript((session) => {
  localStorage.setItem('auth_session', JSON.stringify(session))
}, mockSession)

for (const path of ['/', '/login', '/factory/settings']) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  console.log(`\n=== ${path} ===`)
  console.log(JSON.stringify(await measure(page), null, 2))
}

await browser.close()
