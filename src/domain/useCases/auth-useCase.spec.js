const { MissingParamError } = require('../../utils/erros')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

const makeSut = () => {
  const sut = new AuthUseCase()
  return sut
}
describe('Auth UseCase', () => {
  test('should Throw error if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should Throw error if no password is provided', async () => {
    const sut = makeSut()
    const promise = sut.auth('any_email@Mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
