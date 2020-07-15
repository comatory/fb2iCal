const { expect } = require('chai')
const { mockDayJs, setMockedDay } = require('../mocks/dayjs.mock')
const dayjs = jest.requireActual('dayjs')

const parserUtils = require('../lib/parser-utils')

jest.mock('dayjs', () => mockDayJs)

describe('parserUtils', () => {
  beforeEach(() => {
    setMockedDay(dayjs())
  })

  describe('parse dates', () => {
    it('should format start date', () => {
      const { start } = parserUtils.parseDates(dayjs('2020-03-02 15:35:00'))

      expect(start).to.deep.equal([ 2020, 3, 2, 15, 35 ])
    })


    it('should use current date for start date if not available', () => {
      setMockedDay(dayjs('2020-01-01 12:00:00'))

      const { start } = parserUtils.parseDates()

      expect(start).to.deep.equal([ 2020, 1, 1 ])
    })


    it('should get duration in minutes based on end date', () => {
      const { duration } = parserUtils.parseDates(
        dayjs('2020-03-02 15:35:00'),
        dayjs('2020-03-04 04:30:00')
      )

      expect(duration).to.deep.equal({ minutes: 2215 })
    })


    it('should get duration of 120 minutes if end time is missing', () => {
      const { duration } = parserUtils.parseDates(
        dayjs('2020-03-02 15:35:00'),
      )

      expect(duration).to.deep.equal({ minutes: 120 })
    })
  })
})
