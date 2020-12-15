import App from './components/App.svelte'

import * as stores from './stores'

const boot = () => {
  new App({
    target: document.querySelector('#root'),
  })

  if (process.env.NODE_ENV === 'development') {
    window._fb2ical = {
      ...stores,
    }
  }
}

export default boot
