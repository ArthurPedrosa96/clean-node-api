
const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
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
    console.log(await db.command({ ping: 1 }))
    await MongoHelper.disconnet()
  })

  test('should update the user with the given access token', async () => {
    const userModel = db.collection('users')
    const fakeUser = {
      email: 'valid_email@mail.com',
      name: 'any_name',
      age: 50,
      state: 'any_state',
      password: 'hashed_password'
    }
    const fakeUserInsertion = await userModel.insertOne(fakeUser)
    const sut = new UpdateAccessTokenRepository(userModel)
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
})
