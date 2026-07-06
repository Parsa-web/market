import { chromium } from 'playwright'

const baseUrl = 'http://localhost:5174'
const mockSession = {
  id: 1,
  role: 'factory',
  fullName: 'کارخانه تست',
  company: 'کارخانه تست',
  identifier: '09120000000',
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.addInitScript((session) => {
  localStorage.setItem('auth_session', JSON.stringify(session))
}, mockSession)

await page.goto(`${baseUrl}/factory`, { waitUntil: 'domcontentloaded' })
const early = await page.evaluate(() => ({
  sw: document.documentElement.scrollWidth,
  cw: document.documentElement.clientWidth,
  sx: window.scrollX,
}))
await page.waitForLoadState('networkidle')
const late = await page.evaluate(() => {
  const main = document.querySelector('.dash-main')
  const layout = document.querySelector('.dash-layout')
  const sidebar = document.querySelector('.dash-sidebar')
  return {
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    sx: window.scrollX,
    main: main ? { w: main.offsetWidth, mr: getComputedStyle(main).marginRight, rect: main.getBoundingClientRect().width } : null,
    layout: layout ? { w: layout.offsetWidth, rect: layout.getBoundingClientRect().width } : null,
    sidebar: sidebar ? { transform: getComputedStyle(sidebar).transform, rect: sidebar.getBoundingClientRect() } : null,
  }
})

console.log('early', early)
console.log('late', JSON.stringify(late, null, 2))

await browser.close()
