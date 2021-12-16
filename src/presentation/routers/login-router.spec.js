class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
  }
}

class HttpResponse {
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

class MissingParamError extends Error {
  constructor (missingParamName) {
    super(`Missing param: ${missingParamName}`)
    this.name = 'MissingParamError'
  }
}

describe('Login Router', () => {
  test('should return 400 if no email is provided ', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided ', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if no httpRequest is provided ', () => {
    const sut = new LoginRouter()

    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })
  test('should return 500 if httpRequest has no body ', () => {
    const sut = new LoginRouter()

    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
