var html = require('buoyancy/html')
var css = require('sheetify')
var commandForm = require('../command-form')
var commandButtons = require('../command-buttons')
var metaSearch = require('../meta-search')
var notifier = require('../notifier')

var prefix = css `
  :host {
    margin: 0;
    padding: 0
  }
  :host>nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, .75);
    z-index: 9999;
  }
`

var onload = require('on-load')

module.exports = function (data, params, route, actionsUp) {
  var root = html `
    <section class=${prefix}>
      <nav id="commands" role="navigation">
        ${commandForm(data, actionsUp)}
        ${commandButtons(data, actionsUp)}
      </nav>
      ${metaSearch(data, actionsUp)}
      ${notifier(data, actionsUp)}
    </section>
  `

  onload(root, x => document.querySelector('#command').focus())

  return root
}
