var d = require('global/document')
var Scroll = require('smooth-scroll')

module.exports = function (emitter, proxy) {
  var scroll = new Scroll()

  emitter.on('dom:changeInputValue', e => (proxy.input = e.target.value))
  emitter.on('dom:clearResultMetaSearch', e => (proxy.resultMetaSearch = {}))
  emitter.on('dom:smoothScroll', selector => {
    scroll.animateScroll(d.querySelector(selector))
  })
}
