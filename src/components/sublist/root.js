var html = require('buoyancy/html')
var css = require('sheetify')
var commandButtons = require('../command-buttons')
var sublist = require('./list')
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

module.exports = function (data, params, route, actionsUp) {
  return html `
    <section class=${prefix}>
      <nav id="commands" role="navigation">
        ${commandButtons(data, actionsUp)}
      </nav>
      ${sublist(data, actionsUp)}
      ${notifier(data, actionsUp)}
    </section>
  `
}
