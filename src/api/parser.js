var setup = require('./parsers/parser')
var ClearParser = require('./parsers/clear')
var DoneParser = require('./parsers/done')
var FavsParser = require('./parsers/favs')
var MetaSearchParser = require('./parsers/meta-search')

module.exports = function (emitter, getData) {
  var parser = setup(
    emitter,
    ClearParser,
    DoneParser,
    FavsParser,
    MetaSearchParser
  )
  emitter.on('parser:parse', str => parser.parse(str))
}
