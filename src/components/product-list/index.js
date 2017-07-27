var html = require('buoyancy/html')
var css = require('sheetify')
var product = require('./product')

var prefix = css `
  :host {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: baseline;
  }
`

module.exports = function (list, data, actionsUp) {
  return html `
    <section class=${prefix}>
      ${list.map(o => product(o, data, actionsUp))}
    </section>
  `
}
