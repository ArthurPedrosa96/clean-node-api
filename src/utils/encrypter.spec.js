const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')
const { MissingParamError } = require('./erros')

const makeSut = () => {
  const sut = new Encrypter()
  return { sut }
}

describe('Encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    const { sut } = makeSut()
    const isValid = await sut.compare('any_value', 'hased_value')
    expect(isValid).toBe(true)
  })

  test('should return false if bcrypt returns false', async () => {
    const { sut } = makeSut()
    bcrypt.isValidValue = false
    const isValid = await sut.compare('any_value', 'hased_value')
    expect(isValid).toBe(false)
  })

  test('should call bcrypt with correct values', async () => {
    const { sut } = makeSut()
    await sut.compare('any_value', 'hashed_value')
    expect(bcrypt.value).toBe('any_value')
    expect(bcrypt.hashedValue).toBe('hashed_value')
  })

  test('should throws an error if no params are provided', async () => {
    const { sut } = makeSut()
    expect(sut.compare()).rejects.toThrow(new MissingParamError('value for bcrypt'))
    expect(sut.compare('any_value')).rejects.toThrow(new MissingParamError('hashedValue for bcrypt'))
  })
})
