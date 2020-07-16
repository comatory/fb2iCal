const { expect } = require('chai')

const parseUsingDOM = require('../../lib/services/dom-parser')
const MockLogger = require('../../mocks/logger.mock')

describe(parseUsingDOM, () => {
  let logger

  beforeEach(() => {
    logger = new MockLogger()
  })

  describe('results', () => {
    it('should return page title', () => {
      const html = `
        <html>
          <head>
            <title>Test</title>
          </head>
        </html>
      `
      const { title } = parseUsingDOM(html, { logger })

      expect(title).to.equal('Test')
    })


    describe('time', () => {
      it('should return start time', () => {
        const html = `
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div id="event_summary">
                <div class="test_eventNode1"></div>
                <div class="test_eventNode2"><div class="test_timeNode" title="2020/3/2 at 13:30"></div></div>
              </div>
            </body>
          </html>
        `
        const { start } = parseUsingDOM(html, { logger })

        expect(start).to.deep.equal([ 2020, 3, 2, 13, 30 ])
      })


      it('should return current time if no time data is found', () => {
        const now = new Date('2020-01-01 12:00:00')
        const spy = jest
          .spyOn(global, 'Date')
          .mockImplementation(() => now)

        const html = `
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div id="event_summary">
                <div class="test_eventNode1"></div>
              </div>
            </body>
          </html>
        `
        const { start } = parseUsingDOM(html, { logger })

        spy.mockRestore()

        expect(start).to.deep.equal([ 2020, 1, 1, 12, 0 ])
      })


      it('should return duration of minimum 120 minutes if  ' +
         'no time data is found', () => {
        const now = new Date('2020-01-01 12:00:00')
        const spy = jest
          .spyOn(global, 'Date')
          .mockImplementation(() => now)

        const html = `
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div id="event_summary">
                <div class="test_eventNode1"></div>
              </div>
            </body>
          </html>
        `
        const { duration } = parseUsingDOM(html, { logger })

        spy.mockRestore()

        expect(duration).to.deep.equal({ minutes: 120 })
      })




      it('should return duration based on start time', () => {
        const html = `
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div id="event_summary">
                <div class="test_eventNode1"></div>
                <div class="test_eventNode2"><div class="test_timeNode" title="2020/3/2 at 13:30–15:30"></div></div>
              </div>
            </body>
          </html>
        `
        const { duration } = parseUsingDOM(html, { logger })

        expect(duration).to.deep.equal({ minutes: 120 })
      })
    })

    describe('location', () => {
      it('should return approximated location and area', () => {
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
        const { location } = parseUsingDOM(html, { logger })

        expect(location).to.equal('123 Main St. AcmeTown, Main area')
      })


      it('should return only approximated location', () => {
        const html = `
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div id="event_summary">
                <div class="test_eventNode1"></div>
                <div class="test_eventNode2"><div class="test_timeNode"></div><div class="test_locationNode"><table><tr><td><span></span><span>123 Main St.\nAcmeTown</span></td></tr></table></div></div>
              </div>
            </body>
          </html>
        `
        const { location } = parseUsingDOM(html, { logger })

        expect(location).to.equal('123 Main St. AcmeTown')
      })


      it('should return only approximated area', () => {
        const html = `
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div id="event_summary">
                <div class="test_eventNode1"></div>
                <div class="test_eventNode2"><div class="test_timeNode"></div><div class="test_locationNode"><table><tr><td><span></span><span></span><span>Some area</span></td></tr></table></div></div>
              </div>
            </body>
          </html>
        `
        const { location } = parseUsingDOM(html, { logger })

        expect(location).to.equal('Some area')
      })


      it('should NOT return location or area', () => {
        const html = `
          <html>
            <head>
              <title>Test</title>
            </head>
            <body>
              <div id="event_summary">
                <div class="test_eventNode1"></div>
                <div class="test_eventNode2"><div></div><div></div>
              </div>
            </body>
          </html>
        `
        const { location } = parseUsingDOM(html, { logger })

        expect(location).to.equal('')
      })
    })
  })

  describe('logging', () => {
    it('should log parsing', (callback) => {
      logger.on('test:log', () => {
        callback()
      })

      parseUsingDOM('', { logger })
    })


    it('should log with message', (callback) => {
      logger.on('test:log', ({ message }) => {
        expect(message).to.equal('Using fallback DOM parser')
        callback()
      })

      parseUsingDOM('', { logger })
    })


    it('should log with log level', (callback) => {
      logger.on('test:log', ({ level }) => {
        expect(level).to.equal('info')
        callback()
      })

      parseUsingDOM('', { logger })
    })


    it('should log with service description', (callback) => {
      logger.on('test:log', ({ service }) => {
        expect(service).to.equal('parser')
        callback()
      })

      parseUsingDOM('', { logger })
    })
  })

  describe('null results', () => {
    it('should return null if no title is present in page', () => {
      const html = `
        <html>
          <head>
            <title></title>
          </head>
        </html>
      `
      const eventData = parseUsingDOM(html, { logger })

      expect(eventData).to.be.null
    })


    it('should NOT return start time without title', () => {
      const html = `
        <html>
          <head>
            <title></title>
          </head>
          <body>
            <div id="event_summary">
              <div class="test_eventNode1"></div>
              <div class="test_eventNode2"><div class="test_timeNode" title="2020/3/2 at 13:30"></div></div>
            </div>
          </body>
        </html>
      `
      const eventData = parseUsingDOM(html, { logger })

      expect(eventData).to.be.null
    })
  })
})
