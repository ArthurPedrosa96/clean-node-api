module.exports = (req, res, next) => {
  res.set('access-control-allow-origin', '*')
  res.set('access-control-allow-methods', 'POST, GET, OPTIONS, DELETE, PUT')
  res.set('access-control-allow-headers', '*')
  next()
}
