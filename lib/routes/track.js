const track = (logger) => async (req, res) => {
  try {
    if (!logger) {
      return res.status(501)
    }

    const { message, service, level, env } = req.body

    await logger.log({
      message,
      level,
      service,
      env: process.env.NODE_APP || env || 'N/A',
    })

    res.status(200).send({ status: 'ok' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  track,
}
