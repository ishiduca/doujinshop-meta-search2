var notifier = require('./_notifier')

module.exports = function (emitter, getData) {
  var notify = notifier(emitter)
  emitter.on('notifier:notif', o => notify.notify(o))
  emitter.on('notifier:error', o => notify.error(o))
  emitter.on('notifier:close', () => notify.close())
}
