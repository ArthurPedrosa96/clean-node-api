const MissingParamError = require('../errors/missing-param')
const UnauthorizedError = require('../errors/unathorized')
const ServerError = require('../errors/server')
module.exports = class HttpResponse {
  static badRequest (missingParamName) {
    return {
      statusCode: 400,
      body: new MissingParamError(missingParamName)

    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static success (accessToken) {
    return {
      statusCode: 200,
      body: {
        accessToken: accessToken
      }
    }
  }
}
