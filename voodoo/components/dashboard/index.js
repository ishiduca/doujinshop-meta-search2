var yo = require('yo-yo-with-proxy/html')
var commandForm = require('./command-form')
var hero = require('./hero')
var resultMetaSearch = require('./result-metasearch')
var resultMetaSearchList = require('./result-metasearch-list')
var notify = require('./notify')

var css = require('sheetify')
css('../css/bulma-v0.6.1/css/bulma.css')

module.exports = function (proxy, params, uri, actionsUp) {
  return yo`
    <div>
      ${commandForm(proxy, params, actionsUp)}
      ${hero(proxy, actionsUp)}
      ${resultMetaSearch(proxy, actionsUp)}
      ${resultMetaSearchList(proxy, actionsUp)}
      ${notify(proxy, actionsUp)}
    </div>
  `
}
