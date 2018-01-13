var bl = require('bl')
var xtend = require('xtend')

module.exports = function post (f, sendError) {
  return (req, res, params) => {
    req.pipe(bl((err, raw) => {
      if (err) return sendError(err, req, res)
      var str = String(raw)
      var data; try {
        data = JSON.parse(str)
      } catch (_e) {
        var e = new Error('cat not parse JSON.parse')
        e.name = 'JSONParseError'
        e.data = str
        e.statusCode = 400
        return sendError(e, req, res)
      }

      f(req, res, xtend(params, data))
    }))
  }
}
