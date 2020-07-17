const crawl = async (url, { logger }) => {
  if (logger) {
    logger.log({
      message: `Crawl started for url: ${url}`,
      level: 'info',
      service: 'parser',
    })
  }

  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
    }).then((response) => {
      console.log(response)
      resolve()
    }).catch(reject)
  })
}

export default crawl
