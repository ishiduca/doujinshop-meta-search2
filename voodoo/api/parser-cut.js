var inherits = require('inherits')
var Parser = require('./parser')

module.exports = Cut
inherits(Cut, Parser)

function Cut () {
  Parser.call(this, arguments)
}

Cut.prototype._parse = function (str) {
  if (str.slice(0, 1) === '!') return {error: new Error(`no such a command "${str}"`)}
}
