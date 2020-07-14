const EventEmitter = require('events')

class MockLogger extends EventEmitter {
  log({ message, level, service }) {
    this.emit('test:log', { message, level, service })
  }
}

module.exports = MockLogger
