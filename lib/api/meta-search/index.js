var validate = require('./validate')
var Services = require('./services')
var Alicebooks = require('doujinshop-meta-search-service-alice-books-com')
var Comiczin = require('doujinshop-meta-search-service-shop-comiczin-jp')
var Webdoujindou = require('doujinshop-meta-search-service-web-doujindou-com')
var Melonbooks = require('doujinshop-meta-search-service-www-melonbooks-co-jp')
var Toranoana = require('doujinshop-meta-search-service-www-toranoana-jp')

var services = new Services(
  new Toranoana(),
  new Melonbooks(),
  new Comiczin(),
  new Webdoujindou(),
  new Alicebooks()
)

module.exports = function metaSearch (params, req) {
  try {
    validate(params)
  } catch (err) {
    return Promise.reject(err)
  }

  return services.metaSearch(params, req)
}
