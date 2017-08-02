var Parser = require('./parser').Parser
var inherits = require('inherits')

module.exports = DoneParser
inherits(DoneParser, Parser)

function DoneParser (emitter) {
  Parser.call(this, emitter)
}

DoneParser.prototype._parse = function (str) {
  return new Promise(resolve => {
    if (str.toUpperCase() !== '!DONE') return resolve(false)

    this.emitter.emit('storage:getDoneList')
    this.emitter.emit('link', '/command/done')

    resolve(true)
  })
}
