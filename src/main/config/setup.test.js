const request = require('supertest')
const app = require('./app.js')

describe('App setup', () => {
  test('should disable x-powered-by header', async () => {
    app.get('/test-x-powered-by', (req, res) => {
      res.send('')
    })

    const res = await request(app).get('/test-x-powered-by')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })

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
