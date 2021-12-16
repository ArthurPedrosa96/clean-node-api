const MissingParamError = require('../errors/missing-param')
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
}
