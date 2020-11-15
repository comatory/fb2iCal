const error = (req, res) => {
  const error = req.error || req.query.error || ''

  res
    .status(500)
    .render('error', { error })
}

const notFound = (req, res) => {
  res.status(400).render('404')
}

module.exports = {
  error,
  notFound,
}
