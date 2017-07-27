var html = require('buoyancy/html')

module.exports = function (data, params, route, actionUp) {
  return html `
    <section>
      <h1>doujinshop::meta::search::v2</h1>
      <p><a href="/">dashboard</a></p>
    </section>
  `
}
