var xtend = require('xtend')
var buoyancy = require('buoyancy')
var app = buoyancy({
  commandForm: {
    input: '',
    placeholder: 'input command...'
  },
  notifier: {
    name: null,
    message: null,
    notifyType: null
  },
  metaSearchList: [],
  metaSearchResult: {
    id: null,
    title: null,
    params: null,
    services: []
  },
  sublist: {
    title: null,
    list: []
  }
})

app.reduce(xtend(
  require('./reduce/store-meta-search'),
  require('./reduce/store-sublist'),
  require('./reduce/command-form'),
  require('./reduce/notifier')
))

app.use(require('./api/parser'))
app.use(require('./api/websocket'))
app.use(require('./api/storage'))
app.use(require('./api/link'))
app.use(require('./api/notifier'))
app.use(require('./api/logger'))

app.route('/', require('./components/dashboard/root'))
app.route('/dummy', require('./components/dummy/root'))
app.route('/command/:command', require('./components/sublist/root'))
app.route('/command/:command/:value', require('./components/sublist/root'))

document.body.appendChild(app('/'))
