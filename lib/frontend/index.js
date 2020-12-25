import App from './components/App.svelte'

import * as stores from './stores'
import * as services from './services'
import serviceWorkerBoot from './sw-boot'
import loggerBoot from './logger-boot'

const boot = () => {

  services.storageListener.register()

  serviceWorkerBoot()
  loggerBoot()

  new App({
    target: document.querySelector('#root'),
  })

  if (process.env.NODE_ENV === 'development') {
    window._fb2ical = {
      ...stores,
      ...services,
    }
  }
}

boot()
