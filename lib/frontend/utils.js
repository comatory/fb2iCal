const UNICODE_RE = /[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g

export const migrateRecord = (record) => {
  // NOTE: v3 records
  const id = record.id || record.order
  const startTime = record.startTime || null

  return {
    ...record,
    id,
    startTime,
  }
}

export const sortRecord = (a, b) => {
  const aDate = new Date(a.createdAt)
  const bDate = new Date(b.createdAt)

  if (aDate < bDate) {
    return 1
  }
  if (aDate > bDate) {
    return -1
  }
  return 0
}

// NOTE: Generate random IDs: https://stackoverflow.com/a/2117523/3056783
export const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export const parseStartTimeFromiCalString = (text = '') => {
  const [ dateStr, timeStr ] = text.split('T')
  const rawDate = dateStr || ''
  const rawTime = timeStr || ''

  const year = Number(rawDate.slice(0, 4))
  const month = Number(Math.max(rawDate.slice(4, 6) - 1), 0)
  const date = Number(rawDate.slice(6, 8))
  const hour = Number(rawTime.slice(0, 2))
  const minutes = Number(rawTime.slice(2, 4))
  const seconds = Number(rawTime.slice(4, 6))

  const parsedDate = new Date(year, month, date, hour, minutes, seconds)
  return parsedDate.toString()
}

export const promptDownload = (uri) => {
  const link = document.getElementById('current-download')

  link.setAttribute('href', uri)
  link.setAttribute('download', 'download.ics')
  link.click()

  link.setAttribute('href', '')
}

export const encodeIcalString = (string) => {
  try {
    return encodeURIComponent(string)
  } catch {
    return string.replace(UNICODE_RE , ($0) => {
      return $0.length > 1 ? $0 : '\ufffd';
    })
  }
}
