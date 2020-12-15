import { writable } from 'svelte/store'

import { STORAGE_KEYS } from '../services/storageListener'
import { migrateRecord, sortRecords }  from '../../static/app/storage'

const createEventStore = () => {
  const state = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]')
    .map(migrateRecord)
    .sort(sortRecord)

  const { subscribe, set, update } = writable(state)

  const setCalculation = ({ id, link, createdAt, startTime, title }) => {
    update((prevState) => ([
      ...prevState,
      {
        id,
        link,
        createdAt: createdAt.toString(),
        startTime: startTime.toString(),
        title,
      },
    ]))
  }

  const getState = () => state

  return {
    ...state,
    subscribe,
    set,
    update,
    setCalculation,
    getState,
  }
}

export default createEventStore()
