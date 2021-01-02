const ics = require('ics')

const generateICS = async(data) => {
  return new Promise((resolve, reject) => {
    ics.createEvent({
      ...data,
        startInputType: 'utc',
        endInputType: 'utc',
    }, (err, value) => {
      if (err) {
        reject(err)
        return
      }

      resolve(value)
    })
  })
}

module.exports = generateICS
