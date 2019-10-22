const request = require('request')
const { checkURLFormat, checkNumberURLParameter } = require('./utils')

const useMobileURL = (originalURL) => {
  const urlWithProtocol = originalURL.includes('http') ?
    originalURL :
    `https://${originalURL}`
  const url = new URL(urlWithProtocol)

  return `${url.protocol}//mobile.facebook.com${url.port}${url.pathname}${url.hash}`
}

const createURL = (originalURL) => {
  if (checkURLFormat(originalURL)) {
    return originalURL
  }

  if (checkNumberURLParameter(originalURL)) {
    return `https://facebook.com/events/${originalURL}`
  }

  return ''
}

const crawl = async (originalURL) => {
  const url = useMobileURL(createURL(originalURL))
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
