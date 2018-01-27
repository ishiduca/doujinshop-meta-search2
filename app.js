var path = require('path')
var http = require('http')
var websocket = require('websocket-stream')
var wsr = require('router-on-websocket-stream')()
var ecstatic = require('ecstatic')(path.join(__dirname, 'static'))
var levelup = require('levelup')
var leveldown = require('leveldown')
var encode = require('encoding-down')
var sub = require('subleveldown')
var post = require('./lib/post')
var valid = require('./lib/valid-http')
var routingtonWrap = require('./lib/router')
var router = routingtonWrap()
var sendError = routingtonWrap.sendError

var services = {
  toranoana: require('doujinshop-meta-search-service-www-toranoana-jp')(),
  melonbooks: require('doujinshop-meta-search-service-www-melonbooks-co-jp')(),
  comiczin: require('doujinshop-meta-search-service-shop-comiczin-jp')(),
  webdoujindou: require('doujinshop-meta-search-service-web-doujindou-com')(),
  alicbooks: require('doujinshop-meta-search-service-alice-books-com')()
}

var _db = levelup(encode(leveldown(path.join(__dirname, 'db'))))
var dbs = {
  request: sub(_db, 'request', {valueEncoding: 'json'})
}

var api = require('./api/http')({services: services, dbs: dbs})
var apiWs = require('./api/ws')({services: services, dbs: dbs})
var schemas = {
  search: require('./schema/request/search'),
  deleteQuery: require('./schema/request/delete-query')
}

router.def('/search', post(valid(schemas.search, api.search, sendError), sendError))
router.def('/listup/queries', api.listupQueries)
// router.def('/delete/query/:query', valid(schemas.deleteQuery, api.deleteQuery, sendError))
router.def('/delete/query', post(valid(schemas.deleteQuery, api.deleteQuery, sendError), sendError))

wsr.add('metasearch', apiWs.metasearch)
wsr.add('listupQueries', apiWs.listupQueries)

var app = (module.exports = http.createServer(router.onRequest(ecstatic)))

websocket.createServer({server: app}, ds => ds.on('error', console.error.bind(console)).pipe(wsr.route()).pipe(ds))
