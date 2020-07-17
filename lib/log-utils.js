const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')

const createDailyRotateLogFileTransport = () => {
  const transport =  new (winston.transports.DailyRotateFile)({
    filename: path.join(__dirname, '..', 'logs', 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d',
  })

  return transport
}

const createTransports = (dev) => {
  return [
    dev && new winston.transports.Console(),
    createDailyRotateLogFileTransport(),
  ].filter(transport => transport)
}

const createAppLogger = ({ dev }) => {
  return winston.createLogger({
    transports: createTransports(dev),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  })
}

module.exports = {
  createTransports,
  createAppLogger,
}
