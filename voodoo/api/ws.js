var inject = require('reconnect-core')
var websocket = require('websocket-stream')
var router = require('router-on-websocket-stream')
var safe = require('json-stringify-safe')

module.exports = function (emitter, proxy, opt) {
  var r = router()
  var metasearch = r.method('metasearch')
  var reconnect = inject(uri => websocket(uri))
  var re = reconnect({}, onConnection)

  r.on('error', err => emitter.emit('error', err))
  r.once('finish', () => notify('router finished'))
  r.once('end', () => notify('router ended'))

  re.on('error', err => emitter.emit('error', err))
  re.on('connect', con => notify(`ws proxy connected - "${opt.uri}"`))
  re.on('reconnect', (n, delay) => notify(`reconnect "${n}" times, delay "${delay}"`))
  re.on('disconnect', err => {
    notify('ws proxy disconnected')
    err && emitter.emit('error', err)
  })

  metasearch.on('error', err => emitter.emit('error', err))
  metasearch.on('data', result => {
    if (result.list) emitter.emit('storage:wrapList', result)
    console.log(result)
  })

  emitter.on('ws:metasearch', p => {
    metasearch.write(p)
    notify(`meta search params "${safe(p)}"`)
  })

  re.connect(opt.uri)

  function onConnection (ws) {
    ws.on('error', err => emitter.emit('error', err))
    ws.once('close', () => notify('ws closed'))
    ws.once('end', () => {
      ws.unpipe(r)
      r.unpipe(ws)
      notify('ws ended')
    })
    r.pipe(ws).pipe(r, {end: false})
  }

  function notify (mes) {
    emitter.emit('notifier:notify', mes)
  }
}
