const HttpResponse = require('./helpers/http-response')
const MissingParamError = require('./errors/missing-param')
const InvalidParamError = require('./errors/invalid-param')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!/[\w-]+@[\w-]+.com/.test(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authUseCase.auth(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorizedError()
      }
      return HttpResponse.success(accessToken)
    } catch (error) {
    //   console.error(error)
      return HttpResponse.serverError()
    }
  }
}
