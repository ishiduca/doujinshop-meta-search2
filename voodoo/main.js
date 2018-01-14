var w = require('global/window')
var d = require('global/document')
var voodoo = require('yo-yo-with-proxy')
var pxy = require('./proxy')
var combine = require('./api/parser').combine
var levelup = require('levelup')
var leveldown = require('localstorage-down')
var encode = require('encoding-down')
var sub = require('subleveldown')
var Notifier = require('./api/notifier')
var Storage = require('./api/storage-prototype')

var schema = {
  favs: require('./schema/favs'),
  metasearch: require('../schema/request/search-params')
}
var parser = combine(
  new (require('./api/parser-clear'))(),
  new (require('./api/parser-done'))(),
  new (require('./api/parser-favs'))(schema.favs),
  new (require('./api/parser-cut'))(), // metasearchの前に
  new (require('./api/parser-metasearch'))(schema.metasearch)
)

var interval = 500
var timeout = 8000
var notifier = new Notifier({interval: interval, timeout: timeout})

var loc = w.location
var uri = `${loc.protocol.replace('http', 'ws')}//${loc.host}`

var db = levelup(encode(leveldown('doujinshop::meta::search')))
var storages = {
  done: sub(db, 'done'),
  favs: sub(db, 'favs'),
  product: sub(db, 'product', {valueEncoding: 'json'})
}
var rate = schema.favs.properties.rate.maximum
var storage = new Storage(storages, {rate: rate})

var app = voodoo(pxy.defaultData, pxy)
app.use(require('./api/dom'))
app.use(require('./api/command'), {parser: parser})
app.use(require('./api/notify'), {notifier: notifier})
app.use(require('./api/ws'), {uri: uri})
app.use(require('./api/storage'), {storage: storage})

var dashboard = require('./components/dashboard')
var buttons = require('./components/dashboard/command-buttons')
app.route('/', (proxy, p, u, actup) => dashboard(proxy, buttons, u, actup))

d.body.appendChild(app('/'))
