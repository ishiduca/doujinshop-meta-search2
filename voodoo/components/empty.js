var d = require('global/document')
var hasValue = require('has-value')

module.exports = function (proxy, f) {
  return (proxy === null || !hasValue(proxy)) ? d.createTextNode('') : f()
}
