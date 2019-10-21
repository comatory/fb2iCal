const FBURLError = () => new Error('Not a valid Facebook URL!')

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

const checkFBURL = (req, res, next) => {
  const { url } = req.body

  if (!url) {
    return next(FBURLError())
  }

  try {
    const FBURL = new URL(url)
    if (!(/facebook/.test(FBURL.hostname))) {
      return next(FBURLError())
    }
  } catch (err) {
    return next(err)
  }


  return next()
}

module.exports = {
  genericErrorHandler,
  checkFBURL,
}
