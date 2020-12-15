import { writable } from 'svelte/store'

const createConfigStore = () => {
  const state = JSON.parse(localStorage.getItem('fb-to-ical-config') || '{}')

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
