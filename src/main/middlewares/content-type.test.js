const request = require('supertest')

describe('Content-Type middleware', () => {
  let app
  beforeEach(() => {
    jest.resetModules()
    app = require('../config/app')
  })
  test('should return json content-type as default', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('')
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  test('should return xml content-type if xml content-type is informed', async () => {
    app.get('/test-content-type', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /xml/)
  })
})
