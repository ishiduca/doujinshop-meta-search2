var xtend = require('xtend')

module.exports = function (emitter, _timeout) {
  var msgs = []
  var lock
  var timeout = _timeout || 5000
  var IS_INFO = 'is-info'
  var IS_ERROR = 'is-error'
  var PUMP = 'notifier:pump'
  var DELETE = 'notifier:delete'

  return {
    notify: notify,
    error: error,
    close: close
  }

  function notify (o) {
    msgs.push(xtend(o, {notifyType: IS_INFO}))
    resume()
  }

  function error (o) {
    msgs.push(
     (o instanceof Error)
       ? xtend({name: o.name, message: o.message, notifyType: IS_ERROR})
       : xtend(o, {notifyType: IS_ERROR})
    )
    resume()
  }

  function close () {
    unlock()
    setTimeout(resume, 1000)
    emitter.emit(DELETE)
  }

  function resume () {
    if (lock) return
    var o = msgs.shift()
    if (!o) return
    lock = setTimeout(close, timeout)
    emitter.emit(PUMP, o)
  }

  function unlock () {
    if (lock) clearTimeout(lock)
    lock = null
  }
}
