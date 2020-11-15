const winston = require('winston')
const expressWinston = require('express-winston')
const Transport = require('winston-transport')

class FirebaseTransport extends Transport {
  constructor(options) {
    super(options)
    this._db = options.db
  }

  log(info, callback) {
    try {
      this._db.ref(`log-${new Date().getTime()}`).set(info)
      callback(null, info)
      this.emit('logged', info)
    } catch (err) {
      callback(error)
      this.emit('error', error)
    }

    return info
  }
}

const createRouteLogger = (db) => {
  return expressWinston.logger({
    transports: [
      new FirebaseTransport({ db })
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    meta: true,
    expressFormat: true,
  })
}

const createErrorLogger = ({ db }) => {
  return expressWinston.errorLogger({
    transports: [
      new FirebaseTransport({ db })
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  })
}

const createAppLogger = ({ db }) => {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new FirebaseTransport({ db }),
      new winston.transports.Console(),
    ]
  })
}

module.exports = {
  createRouteLogger,
  createErrorLogger,
  createAppLogger,
}
