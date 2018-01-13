var valid = require('is-my-json-valid')

module.exports = function validHttp (schema, f, sendError) {
  var validate = valid(schema)
  return (req, res, params) => {
    if (validate(params, {verbose: true})) f(req, res, params)
    else sendError(validate.errors, req, res)
  }
}
