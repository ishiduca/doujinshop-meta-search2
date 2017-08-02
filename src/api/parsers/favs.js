var Parser = require('./parser').Parser
var inherits = require('inherits')

module.exports = FavsParser
inherits(FavsParser, Parser)

function FavsParser (emitter) {
  Parser.call(this, emitter)
}

var STORAGE_GET_FAVS_LIST = 'storage:getFavsList'
var METHOD = 'link'
var VALUE = '/command/favs'

FavsParser.prototype._parse = function (str) {
  return new Promise((resolve, reject) => {
    var b = str.split(' ').filter(Boolean)
    if (b[0].toUpperCase() !== '!FAVS') return resolve(false)

    if (!b[1]) {
      this.emitter.emit(STORAGE_GET_FAVS_LIST)
      this.emitter.emit(METHOD, VALUE)
      return resolve(true)
    }

    var rate = Number(b[1])
    var mes = 'argument of "storage:getFavsList" must be "number".' +
              ' and range [1~5]'
    var err
    if (isNaN(rate)) {
      err = new TypeError(mes)
    } else if (rate > 5 || rate < 0) {
      err = new Error(mes)
    }

    if (err) {
      err.data = b[1]
      return reject(err)
    }

    this.emitter.emit(STORAGE_GET_FAVS_LIST, rate)
    this.emitter.emit(METHOD, VALUE + '/' + rate)
    return resolve(true)
  })
}
