const { MongoClient } = require('mongodb')
const { MissingParamError } = require('../../utils/erros/index')

let connection
let db

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    if (!this.userModel) {
      throw new MissingParamError('repository user model')
    }
    const user = await this.userModel.findOne({ email },
      { projection: { password: 1 } })
    return user
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await connection.close()
  })

  test('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@mail.com')
    expect(user).toBeNull()
  })

  test('should return a user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = {
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    }
    const fakeUserInsertion = await userModel.insertOne(fakeUser)
    const user = await sut.load('valid_email@mail.com')
    expect(user).toEqual({
      _id: fakeUserInsertion.insertedId,
      password: fakeUser.password
    })
  })

//   test('should throw an error if no userModel dependency is provided to LoadUserByEmail Repository', async () => {
//     const sut = new LoadUserByEmailRepository()
//     const promise = sut.load('valid_email@mail.com')
//     expect(promise).rejects.toThrow(new MissingParamError('repository user model'))
//   })
})
