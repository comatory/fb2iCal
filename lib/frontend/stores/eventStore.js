import { writable } from 'svelte/store'

import { STORAGE_KEYS } from '../services/storageListener'

const createEventStore = () => {
  const state = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]')

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
