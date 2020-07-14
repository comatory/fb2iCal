const chai = require('chai')
const sinon = require('sinon')
const { expect } = chai
const chaiSinon = require('chai-sinon')
const { mockRequest, setRequestSpy, clearRequestSpy } = require('../../mocks/request.mock')

const crawl = require('../../lib/services/crawler')
const MockLogger = require('../../mocks/logger.mock')

chai.use(chaiSinon)
jest.mock('request', () => mockRequest)

describe(crawl, () => {
  let logger
  let request

  beforeEach(() => {
    logger = new MockLogger()
    clearRequestSpy()
  })

  it('should return promise', () => {
    const promise = crawl('https://abc.xyz', { logger })

    expect(promise).to.be.instanceOf(Promise)
  })

  it('should level log message', (callback) => {
    logger.on('test:log', ({ message, level, service }) => {
      expect(message).to.equal('Crawl started for url: https://abc.xyz')
      expect(level).to.equal('info')
      expect(service).to.equal('parser')
      callback()
    })

    crawl('https://abc.xyz', { logger })
  })


  it('should call request', () => {
    const spy = setRequestSpy()

    crawl('https://abc.xyz', { logger })

    expect(spy).to.have.been.calledOnce
  })


  it('should call request with URL', () => {
    const spy = setRequestSpy()

    crawl('https://zzz.yyy', { logger })

    expect(spy.args[0][0].url).to.equal('https://zzz.yyy')
  })


  it('should call request with `Accept-Language` header value', () => {
    const spy = setRequestSpy()

    crawl('https://zzz.yyy', { logger })

    expect(spy.args[0][0].headers).to.have.property('Accept-Language', 'en-US, en')
  })


  it('should call request with `User-Agent` header value', () => {
    const spy = setRequestSpy()

    crawl('https://zzz.yyy', { logger })

    expect(spy.args[0][0].headers).to.have.property('User-Agent', 'request')
  })
})
