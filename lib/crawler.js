const request = require('request')

const useMobileURL = (originalURL) => {
  const url = new URL(originalURL)

  return `${url.protocol}//mobile.facebook.com${url.port}${url.pathname}${url.hash}`
}

const crawl = async (originalURL) => {
  const url = useMobileURL(originalURL)
  return new Promise((resolve, reject) => {
    console.info(`Started request for URL: ${url}`)
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

      console.info(`Finished request for URL: ${url}`)
      resolve(body)
    })
  })
}

module.exports = crawl
