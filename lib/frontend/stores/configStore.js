import { writable } from 'svelte/store'

const createConfigStore = () => {
  const state = JSON.parse(localStorage.getItem('fb-to-ical-config') || '{}')

  const { subscribe, set, update } = writable(state)

  const setValue = (key, value) => {
    update((prevState) => {
      const nextState = {
        ...prevState,
        [key]: value,
      }

      localStorage.setItem('fb-to-ical-config', JSON.stringify(nextState))

      return nextState
    })
  }

  return {
    ...state,
    subscribe,
    set,
    update,
    setValue,
  }
}

export default createConfigStore()
