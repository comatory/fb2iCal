export const postURL = (data) => {
  return new Promise((resolve, reject) => {
    fetch('/download/html/', {
      method: 'POST',
      headers: {
        'Accept': 'text/html, application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    }).then((response) => {
      if (response.status !== 200) {
        if (response.body.constructor === ReadableStream) {
          response.json().then((json) => reject(json.error || response.statusText))
          return
        }
        reject(response.statusText)
        return
      }

      resolve(response)
    }).catch(reject)
  })
}
