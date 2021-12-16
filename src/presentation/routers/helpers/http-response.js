const MissingParamError = require('../errors/missing-param')
const UnauthorizedError = require('../errors/unathorized')
module.exports = class HttpResponse {
  static badRequest (missingParamName) {
    return {
      statusCode: 400,
      body: new MissingParamError(missingParamName)

    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}
