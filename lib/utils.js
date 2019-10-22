const checkValidURL = (url) => {
  return checkURLFormat(url) ||
    checkNumberURLParameter(url)
}

const checkURLFormat = (url) => {
  return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url)
}

const checkNumberURLParameter = (url) => {
  return /^\d+$/.test(url)
}

const createParserError = () => {
  const err = new Error('Unable to parse event data.')
  err.statusCode = 422

  return err
}

module.exports = {
  checkValidURL,
  checkURLFormat,
  checkNumberURLParameter,
  createParserError,
}
