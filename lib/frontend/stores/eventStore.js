import { writable } from 'svelte/store'

import { STORAGE_KEYS } from '../services/storageListener'
import { migrateRecord, sortRecord }  from '../utils'

const createEventStore = () => {
  const storedState = JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || '[]')
    .map(migrateRecord)
    .sort(sortRecord)

  let state = { events: storedState }

  const getState = () => state

  const { subscribe, set, update } = writable(state)

  const setCalculation = ({ id, link, createdAt, startTime, title }) => {
    update((prevState) => {
      const nextState = {
        ...prevState,
        events: [
          ...prevState.events,
          {
            id,
            link,
            createdAt: createdAt.toString(),
            startTime: startTime.toString(),
            title,
          },
        ]
      }

      state = nextState
      return nextState
    })
  }

  const clearCalculation = (id) => {
    const calculationIndex = getState().events.findIndex((event) => event.id === id)

    if (calculationIndex === -1) {
      return
    }

    const nextEvents = [ ...getState().events ]
    nextEvents.splice(calculationIndex, 1)

    const nextState = { ...getState(), events: nextEvents }
    state = nextState

    set(nextState)
  }

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
