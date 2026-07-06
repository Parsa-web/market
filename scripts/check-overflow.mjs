import { chromium } from 'playwright'

const baseUrl = process.argv[2] || 'http://localhost:5174'
const paths = ['/', '/login', '/register', '/factory', '/factory/settings', '/specialist/settings']
const mockSession = {
  id: 1,
  role: 'factory',
  fullName: 'کارخانه تست',
  company: 'کارخانه تست',
  identifier: '09120000000',
}

function measure(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const offenders = []

    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      if (rect.right > window.innerWidth + 1 || rect.left < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          class: (el.className || '').toString().slice(0, 60),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        })
      }
    })

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      innerWidth: window.innerWidth,
      scrollX: window.scrollX,
      dir: doc.dir,
      offenders: offenders.slice(0, 20),
    }
  })
}

const browser = await chromium.launch()

for (const width of [1280, 1024, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 800 } })
  await page.addInitScript((session) => {
    localStorage.setItem('auth_session', JSON.stringify(session))
  }, mockSession)

  for (const path of paths) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const metrics = await measure(page)
    const overflow = metrics.scrollWidth - metrics.clientWidth
    if (overflow > 0 || metrics.scrollX !== 0 || metrics.offenders.length > 0) {
      console.log(`\n=== ${width}px ${path} overflow=${overflow} scrollX=${metrics.scrollX} ===`)
      console.log(JSON.stringify(metrics, null, 2))
    }
  }

  await page.close()
}

await browser.close()
