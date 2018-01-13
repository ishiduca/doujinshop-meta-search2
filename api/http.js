var safe = require('json-stringify-safe')
var coreApi = require('./core')

module.exports = function (opt) {
  var api = coreApi(opt)

  return {
    search (req, res, params) {
      p(api.search(params), req, res, params)
    },
    listupQueries (req, res, params) {
      p(api.listupQueries(params), req, res, params)
    }
  }

  function p (promise, req, res, params) {
    promise
      .then(result => onSuccess(req, res, params, result))
      .catch(err => onError(req, res, params, err))
  }

  function onSuccess (req, res, request, result) {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(safe({
      result: result,
      request: request
    }))
  }

  function onError (req, res, request, err) {
    res.statusCode = err.statusCode || 400
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(safe({
      errors: [].concat(wrap(err)),
      request: request
    }))
  }

  function wrap (err) {
    err.toJSON || (err.toJSON = function () {
      return {
        name: this.name,
        message: this.message,
        data: this.data
      }
    })
    return err
  }
}
