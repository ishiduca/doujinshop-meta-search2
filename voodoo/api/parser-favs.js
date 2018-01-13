var inherits = require('inherits')
var Parser = require('./parser')
var valid = require('is-my-json-valid')

module.exports = Favs
inherits(Favs, Parser)

function Favs (schema) {
  Parser.call(this, arguments)
  this.validate = valid(schema)
}

Favs.prototype._parse = function (str) {
  var strs = str.toLowerCase().split(' ')
  var favs = strs.shift()
  var rate = parseInt(strs.shift(), 10)
  if (isNaN(rate)) rate = null

  if (favs === '!favs') {
    var o = {command: 'storage:getFavs', params: {rate: rate}}
    var flg = this.validate(o.params, {verbose: true})
    if (flg) return o
    else return {errors: this.validate.errors}
  }
}
