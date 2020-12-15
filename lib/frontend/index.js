import App from './components/App.svelte'

import * as stores from './stores'
import * as services from './services'

const boot = () => {

  services.storageListener.register()

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

export default boot
