const { parse } = require('node-html-parser')

const parseHTML = (html) => {
  let data = {}

  const root = parse(html)
  const eventSummary = root.querySelector('#event_summary')

  const timeInfo = eventSummary.querySelector('#event_time_info')
  const timeContent = timeInfo.querySelector('[content]')

  if (
    timeContent &&
    timeContent.attributes &&
    timeContent.attributes.content
  ) {
    data = {
      ...data,
      time: timeContent.attributes.content.value,
    }
  }

  return data
}

module.exports = parseHTML
