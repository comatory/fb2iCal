import { writable } from 'svelte/store'

import { STORAGE_KEYS } from '../services/storageListener'

const createConfigStore = () => {
  const state = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || '{}')

  const { subscribe, set, update } = writable(state)

  const setValue = (key, value) => {
    update((prevState) => ({ ...prevState, [key]: value }))
  }

  const getState = () => state

  return {
    ...state,
    subscribe,
    set,
    update,
    setValue,
    getState,
  }
}

export default createConfigStore()
