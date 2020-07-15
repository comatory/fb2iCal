const { expect } = require('chai')

const parseUsingLDJSONData = require('../../lib/services/ldjson-parser')
const MockLogger = require('../../mocks/logger.mock')

describe(parseUsingLDJSONData, () => {
  describe('results', () => {
    describe('detect LDJSON', () => {
      it('should detect json with CDATA prefix', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">//<![CDATA[\n{"name":"Event"}\n]\n]></script>
            </head>
          </html>
        `

        const { title } = parseUsingLDJSONData(html, { logger: null })
        
        expect(title).to.equal('Event')
      })


      it('should detect json', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{"name":"Event"}</script>
            </head>
          </html>
        `

        const { title } = parseUsingLDJSONData(html, { logger: null })
        
        expect(title).to.equal('Event')
      })


      it('should throw when JSON parsing fails', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{"name":"Event"</script>
            </head>
          </html>
        `

        expect(() => {
          parseUsingLDJSONData(html, { logger: null })
        }).to.throw('Unexpected end of JSON input')
      })
    })

    describe('time', () => {
      it('should get start time', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{"startDate":"2020-03-02T15:35:00"}</script>
            </head>
          </html>
        `

        const { start } = parseUsingLDJSONData(html, { logger: null })
        
        expect(start).to.deep.equal([ 2020, 3, 2, 15, 35 ])
      })


      it('should return current time for start time if not present', () => {
        const now = new Date('2020-01-01 12:00:00')
        const spy = jest
          .spyOn(global, 'Date')
          .mockImplementation(() => now)

        const html = `
          <html>
            <head>
              <script type="application/ld+json">{}</script>
            </head>
          </html>
        `

        const { start } = parseUsingLDJSONData(html, { logger: null })
        
        expect(start).to.deep.equal([ 2020, 1, 1, 12, 0 ])

        spy.mockRestore()
      })


      it('should get duration based on end and start time', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">
                {
                  "startDate":"2020-03-02T15:35:00",
                  "endDate":"2020-03-02T18:35:00"
                }
              </script>
            </head>
          </html>
        `

        const { duration } = parseUsingLDJSONData(html, { logger: null })
        
        expect(duration).to.deep.equal({ minutes: 180 })
      })


      it('should get default duration of 120 minutes if ' +
         'end date is missing', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{}</script>
            </head>
          </html>
        `

        const { duration } = parseUsingLDJSONData(html, { logger: null })
        
        expect(duration).to.deep.equal({ minutes: 120 })
      })
    })

    describe('url', () => {
      it('should get url', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{"url":"https://abc.xyz"}</script>
            </head>
          </html>
        `

        const { url } = parseUsingLDJSONData(html, { logger: null })
        
        expect(url).to.equal('https://abc.xyz')
      })


      it('should get empty string if url is missing', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{}</script>
            </head>
          </html>
        `

        const { url } = parseUsingLDJSONData(html, { logger: null })
        
        expect(url).to.equal('')
      })
    })

    describe('description', () => {
      it('should get event description', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{"description":"This is event description."}</script>
            </head>
          </html>
        `

        const { description } = parseUsingLDJSONData(html, { logger: null })
        
        expect(description).to.equal('This is event description.')
      })


      it('should get empty string for missing event description', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{}</script>
            </head>
          </html>
        `

        const { description } = parseUsingLDJSONData(html, { logger: null })
        
        expect(description).to.equal('')
      })
    })

    describe('location', () => {
      it('should include name of the location', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": { "name": "Test Location" }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('Test Location')
      })


      it('should include street address of the location', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": {
                  "address": { "streetAddress": "132 Test st." }
                }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('132 Test st.')
      })


      it('should include address locality of the location', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": {
                  "address": { "addressLocality": "South" }
                }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('South')
      })


      it('should include postal code of the location', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": {
                  "address": { "postalCode": "113 AB" }
                }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('113 AB')
      })


      it('should include address country of the location', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": {
                  "address": { "addressCountry": "Liberland" }
                }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('Liberland')
      })


      it('should concatenate address information', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": {
                  "address": {
                    "streetAddress": "132 Test st.",
                    "addressLocality": "South",
                    "postalCode": "113 AB",
                    "addressCountry": "Liberland"
                  }
                }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('132 Test st. South 113 AB Liberland')
      })


      it('should concatenate address information and location name', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": {
                  "name": "D0nut shop",
                  "address": {
                    "streetAddress": "132 Test st.",
                    "addressLocality": "South",
                    "postalCode": "113 AB",
                    "addressCountry": "Liberland"
                  }
                }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('D0nut shop 132 Test st. South 113 AB Liberland')
      })


      it('should concatenate and remove any new lines from location fields', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">{
                "location": {
                  "name": "D0nut\\rshop",
                  "address": {
                    "streetAddress": "132 Test st.",
                    "addressLocality": "South\\nNorth",
                    "postalCode": "113\\nAB",
                    "addressCountry": "Liberland"
                  }
                }
              }
              </script>
            </head>
          </html>
        `

        const { location } = parseUsingLDJSONData(html, { logger: null })

        expect(location).to.equal('D0nut shop 132 Test st. South North 113 AB Liberland')
      })
    })
  })

  describe('null results', () => {
    it('should return null if script with application\/ld+json ' +
       'is not found', () => {
        const html = `
          <html>
            <head>
              <script type="application/ld+json">
              </script>
            </head>
          </html>
        `

        const eventData = parseUsingLDJSONData(html, { logger: null })

        expect(eventData).to.be.null
    })


    it('should return null if script with application\/ld+json ' +
       'has no content', () => {
        const html = `
          <html>
            <head>
              <script type="text/javascript">alert('x')</script>
            </head>
          </html>
        `

        const eventData = parseUsingLDJSONData(html, { logger: null })

        expect(eventData).to.be.null
    })
  })

  describe('logging', () => {
    it('should log with message', (callback) => {
      const logger = new MockLogger()

      logger.on('test:log', ({ message }) => {
        expect(message).to.equal('Parsing using LDJSON parser')
        callback()
      })

      parseUsingLDJSONData('<html></html>', { logger })
    })


    it('should log with level', (callback) => {
      const logger = new MockLogger()

      logger.on('test:log', ({ level }) => {
        expect(level).to.equal('info')
        callback()
      })

      parseUsingLDJSONData('<html></html>', { logger })
    })


    it('should log with service', (callback) => {
      const logger = new MockLogger()

      logger.on('test:log', ({ service }) => {
        expect(service).to.equal('parser')
        callback()
      })

      parseUsingLDJSONData('<html></html>', { logger })
    })
  })
})
