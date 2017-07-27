var html = require('buoyancy/html')
var productList = require('../product-list')

module.exports = function (o, data, actionsUp) {
  return html `
    <section>
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
      ${productList(o.list, data, actionsUp)}
    </section>
  `
}
