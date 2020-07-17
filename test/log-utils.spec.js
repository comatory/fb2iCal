const { expect } = require('chai')
const winston = require('winston')

const logUtils = require('../lib/log-utils')

describe('logUtils', () => {
  it('should create console transport for logging in dev mode', () => {
    expect(logUtils.createTransports(true)[0])
      .to.be.instanceOf(winston.transports.Console)
  })


  it('should NOT create console transport for logging in undefined mode', () => {
    const transports = logUtils.createTransports()

    expect(transports).to.have.length(1)
    expect(transports[0]).to.be.instanceOf(winston.transports.DailyRotateFile)
  })


  it('should create log rotate transport for logging in dev mode', () => {
    expect(logUtils.createTransports(true)[1])
      .to.be.instanceOf(winston.transports.DailyRotateFile)
  })
})
