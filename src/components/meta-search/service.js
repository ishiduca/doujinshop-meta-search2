var html = require('buoyancy/html')
var css = require('sheetify')
var productList = require('../product-list')

var prefix = css `
  :host {
    padding: 0 12px 108px 12px;
  }
  :host header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  :host header>* {
    margin: 0 6px;
  }
`

module.exports = function (o, data, actionsUp) {
  return html `
    <section class=${prefix}>
      <header>
        <h3>${o.service} - (${o.list.length})</h3>
        <div>
          <a
            href=${o.request}
            target="_blank"
            rel="noopener noreferrer"
          >
            request URL
          </a>
        </div>
      </header>
      ${productList(o.list, data, actionsUp)}
    </section>
  `
}
