class RequestError extends Error {
  constructor(status, ...args) {
    super(...args);
    this.status = status;
  }
}

export default RequestError;
