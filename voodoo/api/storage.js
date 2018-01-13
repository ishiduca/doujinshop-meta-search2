var xtend = require('xtend')
var StorageApi = require('./storage-prototype')

module.exports = function (emitter, proxy, opt) {
  var api = new StorageApi(opt.storages, opt.opt)
  var store = {}
  var selector = '#HERO'

  emitter.on('storage:wrapList', result => {
    api.wrapList(result.list, (err, wrapList) => {
      if (err) return emitter.emit('error', err)

      var r = xtend(result, {list: wrapList})
      var q = result.query

      emitter.emit('pause')
      if (store[q] == null) {
        store[q] = []
        proxy.resultMetaSearchList = [q].concat(proxy.resultMetaSearchList)
      }
      store[q].unshift(r)
      proxy.resultMetaSearch = {query: q, _: store[q]}
      emitter.emit('resume')

      console.log(proxy)
    })
  })

  emitter.on('storage:changeFavsRate', (product, r, q) => {
    api.changeFavsRate(product, r, (err, wrapProduct) => {
      if (err) return emitter.emit('error', err)

      emitter.emit('notifier:notify', {
        name: 'apiStorage.changeFavsRate',
        message: `${product.title} => "${r}"`
      })

      find(product, wp => (wp.rate = api.rateToArray(r)))
      proxy.resultMetaSearch = {query: q, _: store[q]}
    })
  })

  emitter.on('storage:toggleDone', (product, q) => {
    api.toggleDone(product, (err, wrapProduct) => {
      if (err) return emitter.emit('error', err)

      emitter.emit('notifier:notify', {
        name: 'apiStorage.toggleDone',
        message: `${product.title} => "${wrapProduct.done}"`
      })

      find(product, wp => (wp.done = wrapProduct.done))
      proxy.resultMetaSearch = {query: q, _: store[q]}
    })
  })

  function scroll () {
    emitter.emit('dom:smoothScroll', selector)
  }

  emitter.on('storage:getResult', (e, q) => {
    e.stopPropagation()
    proxy.resultMetaSearch = {query: q, _: store[q]}
    scroll()
  })

  emitter.on('storage:getDoneList', () => {
    api.getDoneList((err, wrapList) => {
      if (err) return emitter.emit('error', err)

      var q = 'done'
      store[q] = [{
        query: q,
        service: 'localStorage',
        request: null,
        list: wrapList
      }]
      proxy.resultMetaSearch = {query: q, _: store[q]}
      scroll()
    })
  })

  emitter.on('storage:getFavsList', rate => {
    api.getFavsList(rate, (err, wrapList) => {
      if (err) return emitter.emit('error', err)

      var q = `favs ${rate || 'all'}`
      store[q] = [{
        query: q,
        service: 'localStorage',
        request: null,
        list: wrapList
      }]
      proxy.resultMetaSearch = {query: q, _: store[q]}
      scroll()
    })
  })

  function find (product, f) {
    Object.keys(store).forEach(qs => {
      store[qs].forEach(result => {
        result.list.forEach(wrapProduct => {
          if (wrapProduct.id === product.urlOfTitle) f(wrapProduct)
        })
      })
    })
  }
}
