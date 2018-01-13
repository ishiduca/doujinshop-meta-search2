var service = require('../request/search-service')
var result = require('./search-result')

var services = {
  toranoana: 'www.toranoana.jp',
  melonbooks: 'www.melonbooks.co.jjp',
  comiczin: 'shop.comiczin.jp',
  alicebooks: 'alice-books.com',
  webdoujindou: 'web.doujindou.com'
}

service.enum = service.enum.map(s => services[s])

module.exports = {
  title: 'response search',
  type: 'object',
  required: true,
  addtionalPropeties: false,
  properties: {
    service: service,
    request: {
      title: 'response search request',
      type: 'string',
      required: true,
      format: 'uri'
    },
    list: {
      title: 'resposne search list',
      type: 'array',
      required: true,
      items: result
    }
  }
}
