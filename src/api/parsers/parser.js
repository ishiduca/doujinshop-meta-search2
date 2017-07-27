function Parser (emitter) {
  this.emitter = emitter
  this.parser = null
}

Parser.prototype.parse = function (_str) {
  if (typeof _str !== 'string') {
    return this.emitter.emit('error', new TypeError('command must be "string"'))
  }
  var str = _str.split(' ').filter(Boolean).join(' ')
  if (str === '') {
    return this.emitter.emit('error', new Error('command not found'))
  }

  this._parse(str).then(match => {
    if (!match) {
      if (this.parser) {
        this.parser.parse(_str)
      } else {
        this.emitter.emit('error', {
          name: 'command parser message',
          message: `command parsers can not parse "${_str}"`
        })
      }
    }
  }).catch(err => this.emitter.emit('error', err))
}

Parser.prototype._parse = function (str) {
  throw new Error('need to implement "._parse" function yourself')
}

function setup () {
  var args = [].slice.apply(arguments)
  var emitter = args.shift()
  var Parser = args.shift()
  var p = new Parser(emitter)

  args.reduce((p, P) => {
    return (p.parser = new P(emitter))
  }, p)

  return p
}

module.exports = setup
module.exports.Parser = Parser
