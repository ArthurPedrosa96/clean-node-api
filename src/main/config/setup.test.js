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
})
