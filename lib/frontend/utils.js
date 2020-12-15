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
    return -1
  }
  if (aDate > bDate) {
    return 1
  }
  return 0
}

