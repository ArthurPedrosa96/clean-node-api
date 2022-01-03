const UpdateAccessTokenRepository = require('./update-access-token-repository')
const { MissingParamError } = require('../../utils/erros')
const MongoHelper = require('../helpers/mongo-helper')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return { sut, userModel }
}
describe('UpdateAccessToken Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    db = MongoHelper.db
  })

  beforeEach(async () => {
    db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await db.command({ ping: 1 })
    await MongoHelper.disconnet()
  })

  test('should update the user with the given access token', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = {
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    }
    const fakeUserInsertion = await userModel.insertOne(fakeUser)
    await sut.update(fakeUserInsertion.insertedId, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser._id })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw an error if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userModel = db.collection('users')
    const fakeUser = {
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    }
    const fakeUserInsertion = await userModel.insertOne(fakeUser)
    const promise = sut.update(fakeUserInsertion.insertedId, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throw an error if no params are provided', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = {
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    }
    const fakeUserInsertion = await userModel.insertOne(fakeUser)
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(fakeUserInsertion.insertedId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
