var Notifier = require('./notifier')

module.exports = function (emitter, proxy, opt) {
  var notifier = new Notifier(opt)
  var lock = true

  emitter.once('DOMContentLoaded', () => (lock = false))
  emitter.on('error', err => (lock || notifier.publish(err)))
  emitter.on('notifier:notify', m => (lock || notifier.publish(m)))
  emitter.on('notifier:unlock', e => {
    e.stopPropagation()
    notifier.close()
  })

  notifier.subscribe(m => (proxy.notify = m))
}
