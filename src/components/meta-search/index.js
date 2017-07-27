var html = require('buoyancy/html')
var css = require('sheetify')
var metaSearchList = require('./list')
var metaSearchResult = require('./result')

var prefix = css `
  :host {
    display: flex;
    flex-direction: row-reverse;
    margin: 160px 0 200px 0;
  }
`

module.exports = function (data, actionsUp) {
  return html `
    <section class=${prefix}>
      ${metaSearchList(data, actionsUp)}
      ${metaSearchResult(data, actionsUp)}
    </section>
  `
}
