import { writable } from 'svelte/store'

import { STORAGE_KEYS } from '../services/storageListener'
import { migrateRecord, sortRecord }  from '../utils'

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

  const clearCalculation = (id) => {
    const calculationIndex = state.findIndex((event) => event.id === id)

    if (calculationIndex === -1) {
      return
    }

    const nextState = [ ...state ]
    nextState.splice(calculationIndex, 1)

    set(nextState)
  }

  const getState = () => state

  return {
    ...state,
    subscribe,
    set,
    update,
    setCalculation,
    clearCalculation,
    getState,
  }
}

export default createEventStore()
