const { MissingParamError } = require('../../utils/erros')

class AuthUseCase {
  async auth (email) {
    if (!email) {
      throw new MissingParamError('email')
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
})
