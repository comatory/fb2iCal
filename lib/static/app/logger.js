class Logger {
  log({ message, level, service }) {
    console.info(
      `%c${level}\n%c${service}\n%c${message}`,
      'color: white; background-color: blue; font-weight: 800',
      'color: grey',
      'color: black'
    )

    this._log({ message, level, service })
  }

  _log({ message, level, service }) {
    return new Promise((resolve, reject) => {
      fetch('/track', {
        method: 'POST',
        headers: {
          'Accept': 'text/html, application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, level, service, env: 'browser' })
      })
        .then(resolve)
        .catch(reject)
    })
  }
}

export default new Logger()
