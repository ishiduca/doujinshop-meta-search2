module.exports = Parser
module.exports.combine = combine

function Parser (schema) {
  this.schema = schema || null
  this.nextParser = null
}

Parser.prototype.parse = function (str, cb) {
  var c = this._parse(this.prepareParse(str))
  if (c) return cb(null, c)
  if (this.nextParser == null) cb(new Error(`can not parse "${str}"`))
  else this.nextParser.parse(str, cb)
}

Parser.prototype.prepareParse = function (str) {
  return str.split(' ').filter(Boolean).join(' ')
}

Parser.prototype._parse = function (str) {
  throw new Error('you need to implement "_parse" method')
}

function combine () {
  var args = [].slice.apply(arguments)
  var first = args.shift()
  args.reduce(function (a, b) { return (a.nextParser = b) }, first)
  return first
}
