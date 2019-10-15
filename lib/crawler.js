const puppeteer = require('puppeteer')

const crawl = async (url) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)

  const html = await page.evaluate(() => document.body.innerHTML)

  await browser.close()

  return html
}

module.exports = crawl
