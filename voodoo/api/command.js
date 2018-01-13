module.exports = function (emitter, proxy, opt) {
  emitter.on('command:parse', e => {
    e.preventDefault()
    opt.parser.parse(proxy.input, (err, command) => {
      var error = err || command.error || command.errors
      if (error) return (proxy.commandErrors = [].concat(error))

      emitter.emit(`${command.command}`, command.params)

      emitter.emit('pause')
      proxy.input = ''
      proxy.commandErrors = []
      emitter.emit('resume')
    })
  })
}
