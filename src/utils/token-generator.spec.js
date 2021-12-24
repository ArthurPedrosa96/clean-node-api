class TokenGenerator {
  async generate (id) {
    return null
  }
}

const makeSut = () => {
  const sut = new TokenGenerator()
  return sut
}

describe('Token Generator', () => {
  test('should return null is JWT returns null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })
})
