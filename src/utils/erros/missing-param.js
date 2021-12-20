module.exports = class MissingParamError extends Error {
  constructor (missingParamName) {
    super(`Missing param: ${missingParamName}`)
    this.name = 'MissingParamError'
  }
}
