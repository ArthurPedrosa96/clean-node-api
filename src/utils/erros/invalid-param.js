module.exports = class InvalidParamError extends Error {
  constructor (invalidParamName) {
    super(`Invalid Param: ${invalidParamName}`)
    this.name = 'InvalidParamError'
  }
}
