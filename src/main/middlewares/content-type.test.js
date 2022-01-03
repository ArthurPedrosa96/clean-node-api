const request = require('supertest')
const app = require('../config/app')

describe('Content-Type middleware', () => {
  test('should return json content-type as default', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send('')
    })

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  test('should return xml content-type if xml content-type is informed', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
