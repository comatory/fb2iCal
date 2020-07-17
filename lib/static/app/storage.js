import { useStorage } from './utils'

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
  if (!useStorage()) {
    return null
  }

  const storage = localStorage.getItem('fb-to-ical-events')

  if (!storage) {
    localStorage.setItem('fb-to-ical-events', JSON.stringify([]))
    return "[]"
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

const saveRecord = ({ id, link, createdAt, startTime, title }) => {
  if (!useStorage()) {
    return
  }

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
}

const deleteRecord = (id) => {
  if (!useStorage()) {
    return
  }

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

export {
  migrateRecord,
  getStorage,
  getStorageContents,
  updateStorage,
  saveRecord,
  deleteRecord,
}
