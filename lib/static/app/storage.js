// TODO: this import should be removed once refactoring is finished
import { eventStore } from '../../frontend/stores'

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

const saveRecord = ({ id, link, createdAt, startTime, title }) => {
  eventStore.setCalculation({ id, link, createdAt, startTime, title })
}

export {
  getConfigStorage,
  getStorageContents,
  saveRecord,
}
