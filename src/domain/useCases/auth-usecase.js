const { MissingParamError, InvalidParamError } = require('../../utils/erros/index')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, encrypter, tokenGenerator, updateAccessTokenRepository } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError('loadUserByEmailRepository')
    }
    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError('no load method in loadUserByEmailRepository class')
    }
    if (!this.encrypter) {
      throw new MissingParamError('encrypter')
    }
    if (!this.encrypter.compare) {
      throw new InvalidParamError('no compare method in encrypter class')
    }
    if (!this.tokenGenerator) {
      throw new MissingParamError('tokenGenerator')
    }
    if (!this.tokenGenerator.createToken) {
      throw new InvalidParamError('no createToken method in tokenGenerator class')
    }

    const user = await this.loadUserByEmailRepository.load(email)
    const isValidPassword = user && await this.encrypter.compare(password, user.password)

    if (isValidPassword) {
      const accessToken = await this.tokenGenerator.createToken(user.id)
      await this.updateAccessTokenRepository.update(user.id, accessToken)
      return accessToken
    }
    return null
  }
}
