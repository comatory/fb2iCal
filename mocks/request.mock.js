const sinon = jest.requireActual('sinon')

let currentSpy = null

const mockRequest = (options) => {
  try {
    const spy = currentSpy || sinon.spy()

    console.info(`mock request ${JSON.stringify(options)}`)
    spy(options)
  } catch (err) {
    console.trace(err)
  }
}

const setRequestSpy = () => {
  const spy = sinon.spy()

  currentSpy = spy
  return spy
}

const clearRequestSpy = () => {
  currentSpy = null
}

module.exports = {
  mockRequest,
  setRequestSpy,
  clearRequestSpy,
}
