const { error, notFound } = require('./error')
const { download, downloadHTML } = require('./download')
const { track } = require('./track')

module.exports = {
  error,
  notFound,
  download,
  downloadHTML,
  track,
}
