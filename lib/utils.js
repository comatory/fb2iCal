const dayjs = require('dayjs')
const winston = require('winston')
require('winston-daily-rotate-file')
const path = require('path')

const checkValidURL = (url) => {
  return checkURLFormat(url) ||
    checkNumberURLParameter(url)
}

const checkURLFormat = (url) => {
  return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)
}

const checkNumberURLParameter = (url) => {
  return /^\d+$/.test(url)
}

const createParserError = () => {
  const err = new Error('Unable to parse event data.')
  err.statusCode = 422

  return err
}

// NOTE: Using mobile facebook URL because it usually
// contains stringified JSON with event information
const createMobileURL = (originalURL) => {
  const urlWithProtocol = originalURL.includes('http') ?
    originalURL :
    `https://${originalURL}`
  const url = new URL(urlWithProtocol)

  return `${url.protocol}//mobile.facebook.com${url.port}${url.pathname}${url.hash}`
}

// NOTE: Detect whether URL parameter contains
// number or http address
const createURL = (param) => {
  if (checkURLFormat(param)) {
    return param
  }

  if (checkNumberURLParameter(param)) {
    return `https://facebook.com/events/${param}`
  }

  return ''
}

const getNormalizedUrl = (URLparameter) => {
  const fbURL = createURL(URLparameter)
  const mobileUrl = createMobileURL(fbURL)

  return mobileUrl
}

const createDailyRotateLogFileTransport = () => {
  const transport =  new (winston.transports.DailyRotateFile)({
    filename: path.join(__dirname, '..', 'logs', 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d',
  })

  return transport
}

const createTransports = (dev) => {
  return [
    dev && new winston.transports.Console(),
    createDailyRotateLogFileTransport(),
  ].filter(transport => transport)
}

const createAppLogger = ({ dev }) => {
  return winston.createLogger({
    transports: createTransports(dev),
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
}

module.exports = {
  checkValidURL,
  checkURLFormat,
  checkNumberURLParameter,
  createParserError,
  createMobileURL,
  createURL,
  getNormalizedUrl,
  createAppLogger,
  createTransports,
}
