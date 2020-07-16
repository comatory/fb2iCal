let mockCrawlResult = null

const mockCrawl = (url, { logger }) => {
  return mockCrawlResult
}

const setMockCrawlResult = (result) => {
  mockCrawlResult = new Promise((resolve, reject) => {
    resolve(result)
  })
}

const setMockCrawlErrorResult = (error) => {
  mockCrawlResult = new Promise((resolve, reject) => {
    reject(error)
  })
}

const clearMockCrawlResult = () => {
  mockCrawlResult = null
}

module.exports = {
  mockCrawl,
  setMockCrawlResult,
  setMockCrawlErrorResult,
  clearMockCrawlResult,
}
