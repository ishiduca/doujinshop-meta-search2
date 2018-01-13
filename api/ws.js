var coreApi = require('./core')

module.exports = function (opt) {
  var api = coreApi(opt)

  return {
    metasearch (params) { return api.metasearch(params) },
    listupQueries (params) { return api.listupQueries(params) }
  }
}
