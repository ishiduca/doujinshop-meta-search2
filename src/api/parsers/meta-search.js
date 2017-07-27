var Parser = require('./parser').Parser
var inherits = require('inherits')
var validate = require('../../../lib/api/meta-search/validate')

module.exports = MetaSearchParser
inherits(MetaSearchParser, Parser)

function MetaSearchParser (emitter) {
  Parser.call(this, emitter)
}

MetaSearchParser.prototype._parse = function (str) {
  return new Promise(resolve => {
    if (str.slice(0, 1) === '!') return resolve(false)
    if (str.slice(0, 1) !== ':') str = ':mak ' + str
    var a = str.split(' ')
    var c = a.shift().slice(1).toLowerCase()
    var v = a.join(' ')
    var q = {
      category: c,
      value: v
    }

    try {
      validate(q)
    } catch (err) {
      return resolve(false)
    }

    this.emitter.emit('websocket:metaSearch', q)

    resolve(true)
  })
}
