const ics = require('ics')

const generateICS = async(data) => {
  return new Promise((resolve, reject) => {
    ics.createEvent({
      title: data.title || '',
      start: data.start || [],
      duration: data.duration || { hours: 2 },
      location: data.location || '',
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
