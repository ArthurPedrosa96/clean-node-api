const { MissingParamError, InvalidParamError } = require('../../utils/erros')
const AuthUseCase = require('./auth-usecase')

class LoadUserByEmailRepositorySpy {
  async load (email) {
    this.email = email
    return this.user
  }
}

class EncrypterSpy {
  async compare (password, hashedPassword) {
    this.password = password
    this.hashedPassword = hashedPassword
    return this.isValid
  }
}

class TokenGeneratorSpy {
  async createToken (userId) {
    this.userId = userId
    return this.accessToken
  }
}

class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    this.userId = userId
    this.accessToken = accessToken
  }
}

const makeUpdateAccessTokenRepository = () => {
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepository()
  return updateAccessTokenRepositorySpy
}

const makeTokenGenerator = () => {
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeLoadUserByEmailRepository = () => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepositorySpy
}

const makeEncrypter = () => {
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy
  })
  return { sut, loadUserByEmailRepositorySpy, encrypterSpy, tokenGeneratorSpy, updateAccessTokenRepositorySpy }
}

const makeLoadUserByEmailRepositoryWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load () {
      throw new Error()
    }
  }
  return new LoadUserByEmailRepositorySpy()
}

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare () {
      throw new Error()
    }
  }
  return new EncrypterSpy()
}

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    async createToken () {
      throw new Error()
    }
  }
  return new TokenGeneratorSpy()
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepository {
    async update () {
      throw new Error()
    }
  }
  return new UpdateAccessTokenRepository()
}

describe('Auth UseCase', () => {
  test('should Throw error if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should Throw error if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@Mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('should return null is an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('should return null is as invalid password is provided', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('should throw an error if no dependencies are provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  test('should throw an error if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailRepository'))
  })

  test('should throw an error if LoadUserByEmailRepository has no load method', async () => {
    class LoadUserByEmailRepositorySpy { }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    const sut = new AuthUseCase({ loadUserByEmailRepository: loadUserByEmailRepositorySpy })
    const promise = sut.auth('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('no load method in loadUserByEmailRepository class'))
  })

  test('should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('should throw an error if no Encrypter is provided', async () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const tokenGeneratorSpy = makeTokenGenerator()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      tokenGenerator: tokenGeneratorSpy
    })
    const promise = sut.auth('valid_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new MissingParamError('encrypter'))
  })

  test('should throw an error if Encrypter has no compare method', async () => {
    class Encrypter { }
    const encrypterSpy = new Encrypter()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const tokenGeneratorSpy = makeTokenGenerator()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy
    })
    const promise = sut.auth('valid_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow(new InvalidParamError('no compare method in encrypter class'))
  })

  test('should call TokenGenerator with correct user id', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('should throw an error if no tokenGenerator is provided', async () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const encrypterSpy = makeEncrypter()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy
    })
    const promise = sut.auth('valid_email@mail.com', 'valid_password')
    expect(promise).rejects.toThrow(new MissingParamError('tokenGenerator'))
  })

  test('should throw an error if tokenGenerator has no createToken method', async () => {
    class TokenGenerator { }
    const tokenGeneratorSpy = new TokenGenerator()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const encrypterSpy = makeEncrypter()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy
    })
    const promise = sut.auth('valid_email@mail.com', 'valid_password')
    expect(promise).rejects.toThrow(new InvalidParamError('no createToken method in tokenGenerator class'))
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy, updateAccessTokenRepositorySpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  test('should throw an error if no updateAccessTokenRepository is provided', async () => {
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const encrypterSpy = makeEncrypter()
    const tokenGeneratorSpy = makeTokenGenerator()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy
    })
    const promise = sut.auth('valid_email@mail.com', 'valid_password')
    expect(promise).rejects.toThrow(new MissingParamError('UpdateAccessTokenRepository'))
  })

  test('should throw an error if updateAccessTokenRepository has no update method', async () => {
    class UpdateAccessTokenRepository { }
    const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepository()
    const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
    const encrypterSpy = makeEncrypter()
    const tokenGeneratorSpy = makeTokenGenerator()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
      updateAccessTokenRepository: updateAccessTokenRepositorySpy
    })
    const promise = sut.auth('valid_email@mail.com', 'valid_password')
    expect(promise).rejects.toThrow(new InvalidParamError('no update method in UpdateAccessTokenRepository class'))
  })

  test('Should throw if dependencies throw', async () => {
    const suts = [].concat(
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositoryWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        encrypter: makeEncrypter(),
        tokenGenerator: makeTokenGeneratorWithError()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepository(),
        encrypter: makeEncrypter(),
        tokenGenerator: makeTokenGeneratorWithError(),
        updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError()
      })
    )
    for (const sut of suts) {
      const promise = sut.auth('valid_email@mail.com', 'valid_password')
      expect(promise).rejects.toThrow()
    }
  })
})
