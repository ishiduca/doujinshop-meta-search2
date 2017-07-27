var html = require('buoyancy/html')
var productList = require('../product-list')

module.exports = function (data, actionsUp) {
  return html `
    <section>
      <h2>${data.sublist.title}</h2>
      ${productList(data.sublist.list, data, actionsUp)}
    </section>
  `
}
