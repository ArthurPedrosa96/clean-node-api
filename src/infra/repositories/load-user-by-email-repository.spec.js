const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const { MissingParamError } = require('../../utils/erros/index')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    db = MongoHelper.db
  })

  beforeEach(async () => {
    db.collection('users').deleteMany()
  })

  afterAll(async () => {
    console.log(await db.command({ ping: 1 }))
    await MongoHelper.disconnet()
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

  test('Should throw an error if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw an error if no userModel is provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load()
    expect(promise).rejects.toThrow()
  })
})
