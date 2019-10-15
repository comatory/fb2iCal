const cheerio = require('cheerio')
const dayjs = require('dayjs')

const parseHTML = (html) => {
  let data = {}

  const root = cheerio.load(html)

  const $title = root('#event_header_primary h1')
  const titleContent = $title ? $title.text() : null

  if (titleContent) {
    data = {
      ...data,
      title: titleContent,
    }
  }

  const $timeInfo = root('#event_time_info')
  const $time = $timeInfo.find('[content]')

  const timeContent = $time ? $time.attr('content') : null

  if (timeContent) {
    const parsedTimeContent = timeContent
      .split('to')
      .map(part => part.trim())
    const startDate = dayjs(parsedTimeContent[0]) || dayjs()
    const endDate = dayjs(parsedTimeContent[1]) || dayjs()

    const start = [
      startDate.year(),
      startDate.month(),
      startDate.date(),
      startDate.hour(),
      startDate.minute(),
    ]

    const end = [
      endDate.year(),
      endDate.month(),
      endDate.date(),
      endDate.hour(),
      endDate.minute()
    ]

    data = {
      ...data,
      start,
      end,
      // TODO: Create duration from end date
      duration: { hours: 1 },
    }
  }

  const $locations = $timeInfo.next().find('table tr td').get(1)
  const $location = $locations.children[0].children[0]

  const locationContent = $location ? root($location).text() : null

  if (locationContent) {
    data = {
      ...data,
      location: locationContent,
    }
  }

  return data
}

module.exports = parseHTML
