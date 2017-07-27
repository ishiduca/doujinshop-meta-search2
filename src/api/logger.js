module.exports = function (emitter, geData) {
  emitter.on('error', err => {
    console.error(err)
    emitter.emit('notifier:error', err)
  })

  emitter.on('*', function () {
    console.log('event - "%s"', this.event)
    console.log([].slice.apply(arguments))
  })
}
