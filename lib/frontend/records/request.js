export default class Request {
  constructor({
    id,
    url,
    error,
  }) {
    this.id = id
    this.url = url
    this.error = error
  }
}
