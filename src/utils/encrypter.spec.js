const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hashedValue) {
    const isValid = await bcrypt.compare(value, hashedValue)
    return isValid
  }
}

describe('Encrypter', () => {
  test('should return true if bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'hased_value')
    expect(isValid).toBe(true)
  })

  test('should return false if bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValidValue = false
    const isValid = await sut.compare('any_value', 'hased_value')
    expect(isValid).toBe(false)
  })
})
