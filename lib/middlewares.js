const winston = require('winston')
const expressWinston = require('express-winston')
const path = require('path')
const { checkValidURL, createTransports } = require('./utils')
const MissingURLParameter = () => new Error('Please provide valid URL or event number.')

const sendJSON = (req) => {
  return req.accepts().includes('application/json')
}

const genericErrorHandler = (err, req, res, next) => {
  if (sendJSON(req)) {
    res
      .status(500)
      .send({ error: err.toString() })
    return
  }

  res
    .status(500)
    .render('error', { error: err.toString() })
}

const checkURLParameter = (req, res, next) => {
  const { url } = req.body

  if (!url || !checkValidURL(url)) {
    return next(MissingURLParameter())
  }

  return next()
}

const forceSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'http') {
    return res.status(301).redirect(`https://${req.headers.host}/`)
  }
  return next()
}

const createRouteLogger = ({ dev }) => {
  return expressWinston.logger({
    transports: createTransports(dev),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    meta: true,
    expressFormat: true,
  })
}

const createErrorLogger = ({ dev }) => {
  return expressWinston.errorLogger({
    transports: createTransports(dev),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  })
}

module.exports = {
  genericErrorHandler,
  checkURLParameter,
  forceSecure,
  createRouteLogger,
  createErrorLogger,
}
