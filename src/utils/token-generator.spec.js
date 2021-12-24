const jwt = require('jsonwebtoken')
const { MissingParamError } = require('./erros')
const TokenGenerator = require('./token-genrator')

const makeSut = () => {
  const sut = new TokenGenerator('secret')
  return sut
}

const makeSutWithError = () => {
  const sut = new TokenGenerator()
  return sut
}

describe('Token Generator', () => {
  test('should return null is JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('should return a token is JWT returns a token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('should call JWT with correct id', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('should throw an error if no id is provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })

  test('should throw an error if no secret dependency is provided', async () => {
    const sut = makeSutWithError()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('secret dependency'))
  })
})
