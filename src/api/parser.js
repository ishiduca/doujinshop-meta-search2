var setup = require('./parsers/parser')
var MetaSearchParser = require('./parsers/meta-search')

module.exports = function (emitter, getData) {
  var parser = setup(
    emitter,
    MetaSearchParser
  )
  emitter.on('parser:parse', str => parser.parse(str))
}
