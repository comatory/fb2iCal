class Logger {
  log({ message, level, service }) {
    console.info(
      `%c${level}\n%c${service}\n%c${message}`,
      'color: white; background-color: blue; font-weight: 800',
      'color: grey',
      'color: black'
    )
  }
}

export default new Logger()
