var inherits = require('inherits')
var Parser = require('./parser')

module.exports = Clear
inherits(Clear, Parser)

function Clear () {
  Parser.call(this, arguments)
}

Clear.prototype._parse = function (str) {
  var v = str.toLowerCase()
  if (v === '!clear' || v === '!c') return {command: 'dom:clearResultMetaSearch'}
}
