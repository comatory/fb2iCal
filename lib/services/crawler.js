const request = require('request')

const crawl = async (url, { logger }) => {
  if (logger) {
    logger.log({
      message: `Crawl started for url: ${url}`,
      level: 'info',
      service: 'parser',
    })
  }

  return new Promise((resolve, reject) => {
    request({
      url,
      headers: {
        'Accept-Language': 'en-US, en',
        'User-Agent': 'request',
      },
    }, (err, res, body) => {
      if (err) {
        reject(err)
        return
      }

      resolve(body)
    })
  })
}

module.exports = crawl
