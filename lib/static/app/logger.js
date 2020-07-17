class Logger {
  log({ message, level, service }) {
    console.info(`%c${level}\n%c${service}\n${message}`, "color: blue, color: grey")
  }
}

export default new Logger()
