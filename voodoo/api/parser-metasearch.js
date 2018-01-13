var inherits = require('inherits')
var Parser = require('./parser')
var valid = require('is-my-json-valid')

module.exports = MetaSearch
inherits(MetaSearch, Parser)

function MetaSearch (schema) {
  Parser.call(this, arguments)
  this.validate = valid(schema)
}

MetaSearch.prototype._parse = function (str) {
  if (str.slice(0, 1) !== ':') str = `:mak ${str}`

  var c = str.split(' ')
  var category = c.shift().slice(1)
  var value = c.join(' ')
  var p = {category: category, value: value}

  return (this.validate(p, {verbose: true}))
    ? {command: 'ws:metasearch', params: p}
    : {errors: this.validate.errors}
}
