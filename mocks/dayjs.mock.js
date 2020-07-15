const dayjs = jest.requireActual('dayjs')

let mockedDay = null

const mockDayJs = (args, options) => {
  return mockedDay || dayjs(args, options)
}

const setMockedDay = (args, options) => {
  mockedDay = dayjs(args, options)
  return mockedDay
}

module.exports = { mockDayJs, setMockedDay }
