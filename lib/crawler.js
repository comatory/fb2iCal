const puppeteer = require('puppeteer')

const crawl = async (url) => {
  console.log(`crawl started for URL ${url}`)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)

  const html = await page.evaluate(() => document.body.innerHTML)

  await browser.close()

  console.log(`crawl finished for URL ${url}`)

  return html
}

module.exports = crawl
