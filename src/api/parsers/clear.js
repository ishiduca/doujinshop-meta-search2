var Parser = require('./parser').Parser
var inherits = require('inherits')

module.exports = ClearParser
inherits(ClearParser, Parser)

function ClearParser (emitter) {
  Parser.call(this, emitter)
}

ClearParser.prototype._parse = function (str) {
  return new Promise(resolve => {
    if (str.toUpperCase() !== '!CLEAR') return resolve(false)

    this.emitter.emit('link', '/dummy')
    resolve(true)
  })
}
