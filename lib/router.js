var url = require('url')
var xtend = require('xtend')
var safe = require('json-stringify-safe')
var routington = require('routington')

module.exports = function wrapRoutington () {
  var router = routington()

  router.def = function (pattern, api) {
    var node = this.define(pattern)[0]
    return (node.api = api)
  }

  router.onRequest = function onRequest (ecstatic) {
    return (req, res) => {
      var u = url.parse(req.url, true)
      var m = this.match(u.pathname)
      if (m == null || (m.node || {}).api == null) return ecstatic(req, res)
      else m.node.api(req, res, xtend(u.query, m.params))
    }
  }

  return router
}

module.exports.sendError = function (err, req, res) {
  console.log(err)
  res.statusCode = err.statusCode || 500
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(safe({errors: [].concat(wrap(err))}))
}

function wrap (err) {
  err.toJSON || (err.toJSON = function _toJSON () {
    return {
      name: this.name,
      message: this.message,
      data: this.data
    }
  })
  return err
}
