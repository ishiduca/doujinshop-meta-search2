var html = require('buoyancy/html')
var css = require('sheetify')
var service = require('./service')

var prefix = css `
  :host {}
  :host h2 {
    text-align: center;
  }
`

module.exports = function (data, actionsUp) {
  return html `
    <article class=${prefix}>
      <h2>${data.metaSearchResult.title}</h2>
      <section>
        ${data.metaSearchResult.services.map(o => service(o, data, actionsUp))}
      </section>
    </article>
  `
}
