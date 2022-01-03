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
  let newFakeUserId

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    db = MongoHelper.db
  })

  beforeEach(async () => {
    const userModel = db.collection('users')
    await userModel.deleteMany()
    const fakeUser = await userModel.insertOne({
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    })
    newFakeUserId = fakeUser.insertedId
  })

  afterAll(async () => {
    await db.command({ ping: 1 })
    await MongoHelper.disconnet()
  })

  test('should update the user with the given access token', async () => {
    const { sut, userModel } = makeSut()
    await sut.update(newFakeUserId, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: newFakeUserId })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw an error if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update(newFakeUserId, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throw an error if no params are provided', async () => {
    const { sut } = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update(newFakeUserId)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
