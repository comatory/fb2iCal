const FBURLError = () => new Error('Not a valid Facebook URL!')

const genericErrorHandler = (err, req, res, next) => {
  console.error(err.stack)
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
