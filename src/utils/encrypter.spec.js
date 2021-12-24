const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hashedValue) {
    const isValid = await bcrypt.compare(value, hashedValue)
    return isValid
  }
}

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
})
