var params = require('./search-params')
var service = require('./search-service')

module.exports = {
  title: 'request search schema',
  type: 'object',
  required: true,
  addtionalProperties: false,
  properties: {
    service: service,
    params: params
  }
}
