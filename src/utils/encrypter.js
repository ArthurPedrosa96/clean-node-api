const bcrypt = require('bcrypt')
const { MissingParamError } = require('./erros/index')

module.exports = class Encrypter {
  async compare (value, hashedValue) {
    if (!value) {
      throw new MissingParamError('value for bcrypt')
    }
    if (!hashedValue) {
      throw new MissingParamError('hashedValue for bcrypt')
    }
    const isValid = await bcrypt.compare(value, hashedValue)
    return isValid
  }
}
