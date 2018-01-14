var xtend = require('xtend')

module.exports = function (emitter, proxy, opt) {
  var api = opt.storage
  var store = {}
  var selector = '#HERO'

  function domain (f) {
    return (...args) => {
      var err = args.shift()
      if (err == null) f.apply(null, args)
      else emitter.emit('error', err)
    }
  }

  emitter.on('storage:wrapList', result => {
    api.wrapList(result.list, domain(wrapList => {
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
    }))
  })

  emitter.on('storage:changeFavsRate', (product, r, q) => {
    api.changeFavsRate(product, r, domain(wrapProduct => {
      emitter.emit('notifier:notify', {
        name: 'apiStorage.changeFavsRate',
        message: `${product.title} => "${r}"`
      })

      find(product, wp => (wp.rate = api.rateToArray(r)))
      proxy.resultMetaSearch = {query: q, _: store[q]}
    }))
  })

  emitter.on('storage:toggleDone', (product, q) => {
    api.toggleDone(product, domain(wrapProduct => {
      emitter.emit('notifier:notify', {
        name: 'apiStorage.toggleDone',
        message: `${product.title} => "${wrapProduct.done}"`
      })

      find(product, wp => (wp.done = wrapProduct.done))
      proxy.resultMetaSearch = {query: q, _: store[q]}
    }))
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

  function scroll () {
    emitter.emit('dom:smoothScroll', selector)
  }

  emitter.on('storage:getResult', (e, q) => {
    e.stopPropagation()
    proxy.resultMetaSearch = {query: q, _: store[q]}
    scroll()
  })

  emitter.on('storage:getDoneList', () => {
    api.getDoneList(domain(wrapList => {
      var q = 'done'
      store[q] = [{
        query: q,
        service: 'localStorage',
        request: null,
        list: wrapList
      }]
      proxy.resultMetaSearch = {query: q, _: store[q]}
      scroll()
    }))
  })

  emitter.on('storage:getFavsList', p => {
    api.getFavsList(p.rate, domain(wrapList => {
      var q = `favs ${p.rate || 'all'}`
      store[q] = [{
        query: q,
        service: 'localStorage',
        request: null,
        list: wrapList
      }]
      proxy.resultMetaSearch = {query: q, _: store[q]}
      scroll()
    }))
  })
}
