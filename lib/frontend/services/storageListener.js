import { STORAGE_KEYS } from '../constants'
import { configStore, eventStore } from '../stores'

class StorageListener {
  constructor() {
    this._storeSubscribers = new Set()
  }

  register() {
    window.addEventListener('storage', this._handleStorageChange)

    const unsubscribeConfigStore = configStore.subscribe(this._handleConfigStoreChange)
    const unsubscribeEventStore = eventStore.subscribe(this._handleEventStoreChange)

    this._storeSubscribers = new Set([
      ...this._storeSubscribers,
      unsubscribeConfigStore,
      unsubscribeEventStore,
    ])
  }

  unregister() {
    window.removeEventListener('storage', this._handleStorageChange)

    this._storeSubscribers.forEach((unsubscribe) => unsubscribe())
    this._storeSubscribers.clear()
  }

  _handleStorageChange(event) {
    switch (event.key) {
      case STORAGE_KEYS.CONFIG:
        configStore.set(JSON.parse(event.newValue))
        break
      case STORAGE_KEYS.EVENTS:
        eventStore.set({ events: JSON.parse(event.newValue) })
        break
      default:
        return
    }
  }

  _handleConfigStoreChange(value) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(value))
  }

  _handleEventStoreChange(value) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(value.events || []))
  }
}

export default new StorageListener()
