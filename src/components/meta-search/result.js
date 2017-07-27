var html = require('buoyancy/html')
var service = require('./service')

module.exports = function (data, actionsUp) {
  return html `
    <article>
      <h2>${data.metaSearchResult.title}</h2>
      <section>
        ${data.metaSearchResult.services.map(o => service(o, data, actionsUp))}
      </section>
    </article>
  `
}
