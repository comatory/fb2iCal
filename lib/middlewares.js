const { checkValidURL } = require('./utils')
const MissingURLParameter = () => new Error('Please provide valid URL or event number.')

const sendJSON = (req) => {
  return req.accepts().includes('application/json')
}

const genericErrorHandler = (err, req, res, next) => {
  console.error(err.stack)

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

module.exports = {
  genericErrorHandler,
  checkURLParameter,
  forceSecure,
}
