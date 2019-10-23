const dayjs = require('dayjs')

// NOTE: Specific formatting for `ics` library
const parseDates = (startDate, endDate) => {
  const start = startDate ? [
    startDate.year(),
    startDate.month() + 1,
    startDate.date(),
    startDate.hour(),
    startDate.minute(),
  ] : (() => {
    const now = dayjs()

    return [
      now.year(),
      now.month() + 1,
      now.date()
    ]
  })()
  const diffInMinutes = endDate ?
    endDate.diff(startDate, 'minutes') :
    120

  const duration = { minutes: diffInMinutes }

  return {
    start,
    duration,
  }
}

module.exports = { parseDates }
