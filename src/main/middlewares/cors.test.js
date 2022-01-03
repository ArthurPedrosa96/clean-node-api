const request = require('supertest')
const app = require('../config/app')

describe('CORS middleware', () => {
  test('should enable cors', async () => {
    app.get('/test-cors', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test-cors')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('POST, GET, OPTIONS, DELETE, PUT')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })
})
