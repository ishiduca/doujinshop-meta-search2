'use strict'
var http = require('http')
var path = require('path')
var websocket = require('websocket-stream')
var ecstatic = require('ecstatic')(path.join(__dirname, 'static'))
var router = require('router-on-websocket-stream')()
var app = http.createServer(ecstatic)

router.add('metaSearch', require('api/meta-search'))

websocket.createServer({server: app}, s => {
  s.pipe(router.route()).pipe(s)
})

listen(process.env.PORT || 8888)

function listen (port) {
  var mes = 'server listen on port "%s"'
  app.listen(port, () => console.log(mes, port))
}
