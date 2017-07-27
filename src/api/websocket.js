var inject = require('reconnect-core')
var websocket = require('websocket-stream')
var router = require('router-on-websocket-stream')
var w = require('global/window')
var l = w.location
var uri = [ l.protocol.replace('http', 'ws'), '//', l.host ].join('')

module.exports = function (emitter, getData) {
  var reconnect = inject(uri => websocket(uri))
  var re = reconnect({}, ws => {
    ws.once('close', () => notif('wsProxy closed'))
    ws.once('end', () => {
      ws.unpipe(r)
      r.unpipe(ws)
      notif('wsProxy ended')
    })
    ws.on('error', err => emitter.emit('notifier:error', err))
    r.pipe(ws).pipe(r, {end: false})
  })

  var r = router()
  var metaSearch = r.method('metaSearch')

  re.on('error', err => emitter.emit('notifier:error', err))
  metaSearch.on('error', err => emitter.emit('notifier:error', err))

  re.on('connect', () => notif(`wsProxy connected "${uri}"`))

  emitter.on('websocket:metaSearch', q => metaSearch.write(q))

  metaSearch.on('data', result => {
    if (result.responseEnd) return
    emitter.emit('storage:metaSearch', result)
  })

  re.connect(uri)

  function notif (message) {
    emitter.emit('notifier:notif', {message: message})
  }
}
