const dayjs = require('dayjs')

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

module.exports = {
  checkValidURL,
  checkURLFormat,
  checkNumberURLParameter,
  createParserError,
  createMobileURL,
  createURL,
  getNormalizedUrl,
}
