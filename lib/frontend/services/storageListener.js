import { configStore } from '../stores'

const STORAGE_KEYS = {
  CONFIG: 'fb-to-ical-config',
}

class StorageListener {
  constructor() {
    this._storeSubscribers = new Set()
  }

  register() {
    window.addEventListener('storage', this._handleStorageChange)

    const unsubscribeConfigStore = configStore.subscribe(this._handleConfigStoreChange)

    this._storeSubscribers = new Set([
      ...this._storeSubscribers,
      unsubscribeConfigStore,
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
      default:
        return
    }
  }

  _handleConfigStoreChange(value) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(value))
  }
}

export default new StorageListener()
