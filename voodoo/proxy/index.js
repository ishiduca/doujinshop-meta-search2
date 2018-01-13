module.exports = function (defaultData, update) {
  return new Proxy(defaultData, {
    set (o, p, v) {
      o[p] = v
      update()
    }
  })
}

module.exports.defaultData = {
  input: '',
  commandErrors: [],
  resultMetaSearch: {},
  resultMetaSearchList: [],
  notify: {}
}
