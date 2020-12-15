// TODO: this import should be removed once refactoring is finished
import { eventStore } from '../../frontend/stores'

const migrateRecord = (record) => {
  // NOTE: v3 records
  const id = record.id || record.order
  const startTime = record.startTime || null

  return {
    ...record,
    id,
    startTime,
  }
}

const getStorage = () => {
  const storage = localStorage.getItem('fb-to-ical-events')

  if (!storage) {
    localStorage.setItem('fb-to-ical-events', JSON.stringify([]))
    return "[]"
  }

  return storage
}

const getConfigStorage = () => {
  const storage = localStorage.getItem('fb-to-ical-config')

  if (!storage) {
    localStorage.setItem('fb-to-ical-config', JSON.stringify({}))
    return "{}"
  }

  return storage
}

const getStorageContents = (storage) => {
  return JSON.parse(storage)
}

const updateStorage = (storageContents) => {
  const encodedStorage = JSON.stringify(storageContents)

  localStorage.setItem('fb-to-ical-events', encodedStorage)
}

const updateConfigStorage = (storageContents, key, value) => {
  const encodedStorage = JSON.stringify({
    ...storageContents,
    [key]: value,
  })

  localStorage.setItem('fb-to-ical-config', encodedStorage)
}

const saveRecord = ({ id, link, createdAt, startTime, title }) => {
  const storage = getStorage()
  const storageContents = getStorageContents(storage)

  const record = {
    id,
    link,
    createdAt: createdAt.toString(),
    startTime: startTime.toString(),
    title,
  }

  updateStorage([ ...storageContents, record ])

  eventStore.setCalculation({ id, link, createdAt, startTime, title })
}

const deleteRecord = (id) => {
  const storage = getStorage()
  const storageContents = getStorageContents(storage)
  const index = storageContents.findIndex((record) => {
    return record.id === id
  })

  if (!Number.isFinite(index)) {
    return
  }

  const nextStorage = [ ...storageContents ]
  nextStorage.splice(index, 1)

  updateStorage(nextStorage)
}

const sortRecord = (a, b) => {
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

export {
  migrateRecord,
  sortRecord,
  getStorage,
  getConfigStorage,
  getStorageContents,
  updateStorage,
  updateConfigStorage,
  saveRecord,
  deleteRecord,
}
