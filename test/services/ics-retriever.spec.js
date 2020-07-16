const chai = require('chai')
const { expect } = chai
const chaiSinon = require('chai-sinon')

chai.use(chaiSinon)

const MockLogger = require('../../mocks/logger.mock')
const {
  mockCrawl,
  setMockCrawlResult,
  setMockCrawlErrorResult,
  clearMockCrawlResult,
} = require('../../mocks/crawler.mock')

const retrieveICS = require('../../lib/services/ics-retriever')

jest.mock('../../lib/services/crawler', () => mockCrawl)

describe(retrieveICS, () => {
  let logger

  beforeEach(() => {
    logger = new MockLogger()
    clearMockCrawlResult()
  })

  it('should use create ICS contents', async () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">{"name":"Test Event"}</script>
        </head>
      </html>
    `

    setMockCrawlResult(html)

    const icsContent = await retrieveICS('https://facebook.com/events/123', { logger })

    expect(icsContent).to.be.ok
  })


  it('should use create ICS contents based on LDJSON', async () => {
    const html = `
      <html>
        <head>
          <script type="application/ld+json">{"name":"Test Event","location":{"name":"Location X"}}</script>
        </head>
      </html>
    `

    setMockCrawlResult(html)

    const icsContent = await retrieveICS('https://facebook.com/events/123', { logger })

    expect(icsContent).to.include('SUMMARY:Test Event')
    expect(icsContent).to.include('LOCATION:Location X')
  })


  it('should use create ICS contents based on DOM', async () => {
    const html = `
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <div id="event_summary">
            <div class="test_eventNode1"></div>
            <div class="test_eventNode2"><div class="test_timeNode"></div><div class="test_locationNode"><table><tr><td><span></span><span>123 Main St.\nAcmeTown</span><span>Main area</span></td></tr></table></div></div>
          </div>
        </body>
      </html>
    `

    setMockCrawlResult(html)

    const icsContent = await retrieveICS('https://facebook.com/events/123', { logger })

    expect(icsContent).to.include('LOCATION:123 Main St. AcmeTown, Main area')
  })


  it('should throw parser error if no event data is found', async (callback) => {
    const html = `
      <html>
        <head>
        </head>
        <body>
        </body>
      </html>
    `

    setMockCrawlResult(html)

    try {
      const eventData = await retrieveICS('https://facebook.com/events/132', { logger })
    } catch (err) {
      expect(err.toString()).to.include('Unable to parse event data.')
      expect(err.statusCode).to.equal(422)
      callback()
    }
  })


  it('should contain normalized URL when using DOM parser', async () => {
    const html = `
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
        </body>
      </html>
    `

    setMockCrawlResult(html)

    const icsContent = await retrieveICS('123', { logger })
    expect(icsContent).to.include('URL:https://mobile.facebook.com/events/123')

  })
})
