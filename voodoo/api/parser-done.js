var inherits = require('inherits')
var Parser = require('./parser')

module.exports = Done
inherits(Done, Parser)

function Done () {
  Parser.call(this, arguments)
}

Done.prototype._parse = function (str) {
  var v = str.toLowerCase()
  if (v === '!done') return {command: 'storage:getDoneList'}
}
