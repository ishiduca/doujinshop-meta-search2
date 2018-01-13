var test = require('tape')
var xtend = require('xtend')
var safe = require('json-stringify-safe')
var afterAll = require('after-all')
var missi = require('mississippi')
var levelup = require('levelup')
var encode = require('encoding-down')
var leveldown = require('memdown')
var sub = require('subleveldown')
var StorageAPI = require('../voodoo/api/storage-prototype')

var db = levelup(encode(leveldown('doujinshop::meta::search')))
var storages = {
  favs: sub(db, 'favs'),
  done: sub(db, 'done'),
  product: sub(db, 'product', {valueEncoding: 'json'})
}

test('api = new StorageAPI(storages, {rate: 5})', t => {
  var api = new StorageAPI(storages, {rate: 5})
  t.ok(api.opt.rate, 5)
  t.end()
})

test('api.toggleDone(product, callback)', t => {
  var api = new StorageAPI(storages, {rate: 5})
  var product = {
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=333123',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=27118',
    srcOfThumbnail: 'https://cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001149174.jpg&width=319&height=450&c=1&aa=0',
    title: 'Mitsuha～Netorare3～',
    circle: 'シュクリーン'
  }

  t.test('1st false => true', tt => {
    api.toggleDone(product, (err, wrapProduct) => {
      if (err) return console.error(err)
      tt.is(wrapProduct.id, product.urlOfTitle, `wrapProduct.id - "${wrapProduct.id}"`)
      tt.deepEqual(wrapProduct.product, product, `wrapProduct.product - "${safe(wrapProduct.product)}"`)
      tt.is(wrapProduct.done, true, `wrapProduct.done - "${wrapProduct.done}"`)
      tt.deepEqual(wrapProduct.rate, [!1, !1, !1, !1, !1], `wrapProduct.rate - "${safe(wrapProduct.rate)}"`)
      tt.end()
    })
  })
  t.test('2nd true => false && rate => 2', tt => {
    storages.favs.put(product.urlOfTitle, 2, err => {
      if (err) return console.error(err)
      else foo()
    })

    function foo () {
      api.toggleDone(product, (err, wrapProduct) => {
        if (err) return console.error(err)
        tt.is(wrapProduct.id, product.urlOfTitle, `wrapProduct.id - "${wrapProduct.id}"`)
        tt.deepEqual(wrapProduct.product, product, `wrapProduct.product - "${safe(wrapProduct.product)}"`)
        tt.is(wrapProduct.done, false, `wrapProduct.done - "${wrapProduct.done}"`)
        tt.deepEqual(wrapProduct.rate, [!0, !0, !1, !1, !1], `wrapProduct.rate - "${safe(wrapProduct.rate)}"`)
        tt.end()
      })
    }
  })
  t.test('3rd false => true', tt => {
    api.toggleDone(product, (err, wrapProduct) => {
      if (err) return console.error(err)
      tt.is(wrapProduct.id, product.urlOfTitle, `wrapProduct.id - "${wrapProduct.id}"`)
      tt.deepEqual(wrapProduct.product, product, `wrapProduct.product - "${safe(wrapProduct.product)}"`)
      tt.is(wrapProduct.done, true, `wrapProduct.done - "${wrapProduct.done}"`)
      tt.deepEqual(wrapProduct.rate, [!0, !0, !1, !1, !1], `wrapProduct.rate - "${safe(wrapProduct.rate)}"`)
      tt.end()
    })
  })
  t.test('4th true => false && rate => 0', tt => {
    storages.favs.del(product.urlOfTitle, err => {
      if (err) return console.error(err)
      else foo()
    })

    function foo () {
      api.toggleDone(product, (err, wrapProduct) => {
        if (err) return console.error(err)
        tt.is(wrapProduct.id, product.urlOfTitle, `wrapProduct.id - "${wrapProduct.id}"`)
        tt.deepEqual(wrapProduct.product, product, `wrapProduct.product - "${safe(wrapProduct.product)}"`)
        tt.is(wrapProduct.done, false, `wrapProduct.done - "${wrapProduct.done}"`)
        tt.deepEqual(wrapProduct.rate, [!1, !1, !1, !1, !1], `wrapProduct.rate - "${safe(wrapProduct.rate)}"`)
        tt.end()
      })
    }
  })
  t.test('after del', tt => {
    var next = afterAll(err => {
      if (err && !err.notFound) console.error(err)
      tt.end()
    })
    var id = product.urlOfTitle
    storages.product.get(id, next((err, product) => {
      tt.notOk(product, `no exits storages.product "${id}"`)
    }))
    storages.done.get(id, next((err, isDone) => {
      tt.notOk(isDone, `no exits storages.done "${id}"`)
    }))
    storages.favs.get(id, next((err, rate) => {
      tt.notOk(rate, `no exits storages.favs "${id}"`)
    }))
  })

  t.end()
})

test('api.changeFavsRate(product, rate, callback)', t => {
  var api = new StorageAPI(storages, {rate: 5})
  var product = {
    urlOfTitle: 'https://www.melonbooks.co.jp/detail/detail.php?product_id=333123',
    urlOfCircle: 'https://www.melonbooks.co.jp/circle/index.php?circle_id=27118',
    srcOfThumbnail: 'https://cdn.melonbooks.co.jp/user_data/packages/resize_image.php?image=212001149174.jpg&width=319&height=450&c=1&aa=0',
    title: 'Mitsuha～Netorare3～',
    circle: 'シュクリーン'
  }

  t.test('1st 0 => 3', tt => {
    api.changeFavsRate(product, 3, (err, wrapProduct) => {
      if (err) return console.error(err)
      tt.is(wrapProduct.id, product.urlOfTitle, `wrapProduct.id - "${wrapProduct.id}"`)
      tt.deepEqual(wrapProduct.product, product, `wrapProduct.product - "${safe(wrapProduct.product)}"`)
      tt.is(wrapProduct.done, false, `wrapProduct.done - "${wrapProduct.done}"`)
      tt.deepEqual(wrapProduct.rate, [!0, !0, !0, !1, !1], `wrapProduct.rate - "${safe(wrapProduct.rate)}"`)
      tt.end()
    })
  })
  t.test('2nd 3 => 0 && done => true', tt => {
    storages.done.put(product.urlOfTitle, true, err => {
      if (err) return console.error(err)
      foo()
    })

    function foo () {
      api.changeFavsRate(product, 0, (err, wrapProduct) => {
        if (err) return console.error(err)
        tt.is(wrapProduct.id, product.urlOfTitle, `wrapProduct.id - "${wrapProduct.id}"`)
        tt.deepEqual(wrapProduct.product, product, `wrapProduct.product - "${safe(wrapProduct.product)}"`)
        tt.is(wrapProduct.done, true, `wrapProduct.done - "${wrapProduct.done}"`)
        tt.deepEqual(wrapProduct.rate, [!1, !1, !1, !1, !1], `wrapProduct.rate - "${safe(wrapProduct.rate)}"`)
        tt.end()
      })
    }
  })
  t.test('3rd done => false', tt => {
    storages.done.del(product.urlOfTitle, err => {
      if (err) return console.error(err)
      foo()
    })

    function foo () {
      api.changeFavsRate(product, 0, (err, wrapProduct) => {
        if (err) return console.error(err)
        tt.is(wrapProduct.id, product.urlOfTitle, `wrapProduct.id - "${wrapProduct.id}"`)
        tt.deepEqual(wrapProduct.product, product, `wrapProduct.product - "${safe(wrapProduct.product)}"`)
        tt.is(wrapProduct.done, false, `wrapProduct.done - "${wrapProduct.done}"`)
        tt.deepEqual(wrapProduct.rate, [!1, !1, !1, !1, !1], `wrapProduct.rate - "${safe(wrapProduct.rate)}"`)
        tt.end()
      })
    }
  })
  t.test('after del', tt => {
    var next = afterAll(err => {
      if (err && !err.notFound) console.error(err)
      tt.end()
    })
    var id = product.urlOfTitle
    storages.product.get(id, next((err, product) => {
      tt.notOk(product, `no exits storages.product "${id}"`)
    }))
    storages.done.get(id, next((err, isDone) => {
      tt.notOk(isDone, `no exits storages.done "${id}"`)
    }))
    storages.favs.get(id, next((err, rate) => {
      tt.notOk(rate, `no exits storages.favs "${id}"`)
    }))
  })

  t.end()
})

var list = require('./result').result.list
test('api.getDoneList(callback)', t => {
  var api = new StorageAPI(storages, {rate: 5})

  setup(() => {
    api.getDoneList((err, wrapList) => {
      t.is(wrapList.length, list.length, `wrapList.length - "${wrapList.length}"`)
      var sorted = wrapList.sort((a, b) => (a.product.circle > b.product.circle ? 1 : a.product.circle < b.product.circle ? -1 : 0))
      t.deepEqual(sorted[0], {
        id: 'http://www.toranoana.jp/mailorder/article/04/0030/17/58/040030175812.html',
        done: true,
        product: {
          urlOfTitle: 'http://www.toranoana.jp/mailorder/article/04/0030/17/58/040030175812.html',
          urlOfCircle: 'http://www.toranoana.jp/cgi-bin/R2/d_search.cgi?bl_fg=0&item_kind=0401&mak=O%2eRIginal%20brand&img=1&stk=1&makAg=1&p1=63&p2=07&p3=5730303230373633',
          srcOfThumbnail: 'http://img.toranoana.jp/img18/04/0030/17/58/040030175812-1r.gif',
          title: 'こちら○○ゲー製作株式会社!!2',
          circle: 'O.RIginal brand' },
        rate: [ false, false, false, false, false ]
      }, safe(sorted[0]))
      t.deepEqual(sorted[list.length - 1], {
        id: 'http://www.toranoana.jp/mailorder/article/04/0030/59/82/040030598295.html',
        done: true,
        product: {
          urlOfTitle: 'http://www.toranoana.jp/mailorder/article/04/0030/59/82/040030598295.html',
          urlOfCircle: 'http://www.toranoana.jp/cgi-bin/R2/d_search.cgi?bl_fg=0&item_kind=0401&mak=O%2eRIginal%20brand&img=1&stk=1&makAg=1&p1=63&p2=07&p3=5730303230373633',
          srcOfThumbnail: 'http://img.toranoana.jp/img18/04/0030/59/82/040030598295-1r.gif',
          title: 'GALIUSS1',
          circle: 'O.RIginal brand' },
          rate: [ false, false, false, false, false ]
      }, safe(sorted[list.length - 1]))
      t.end()
    })
  })

  function setup (f) {
    reads(list.slice(0))
      .on('error', err => console.error(err))
      .on('data', d => null)
      .on('end', f)

    function reads (list) {
      return missi.from.obj((size, next) => {
        var p = list.shift()
        if (p == null) return next(null, null)
        api.toggleDone(p, (err, wrapProduct) => err ? next(err) : next(null, wrapProduct))
      })
    }
  }
})

test('api.getFavsList(rate, callback)', t => {
  var api = new StorageAPI(storages, {rate: 5})
  setup(() => {
    t.test('rate == null', tt => {
      api.getFavsList(null, (err, wrapList) => {
        tt.ok(wrapList.length, list.length, `wrapList.length - ${wrapList.length}`)
        var sorted = wrapList.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
        tt.deepEqual(sorted[0], {
          id: 'http://www.toranoana.jp/mailorder/article/04/0010/22/14/040010221405.html',
          rate: [ true, true, true, true, true ],
          product: {
            urlOfTitle: 'http://www.toranoana.jp/mailorder/article/04/0010/22/14/040010221405.html',
            urlOfCircle: 'http://www.toranoana.jp/cgi-bin/R2/d_search.cgi?bl_fg=0&item_kind=0401&mak=O%2eRIginal%20brand&img=1&stk=1&makAg=1&p1=63&p2=07&p3=5730303230373633',
            srcOfThumbnail: 'http://img.toranoana.jp/img18/04/0010/22/14/040010221405-1r.gif',
            title: 'L4',
            circle: 'O.RIginal brand' },
          done: true }, safe(sorted[0]))
        tt.deepEqual(sorted[sorted.length - 1], {
          id: 'http://www.toranoana.jp/mailorder/article/04/0030/59/82/040030598295.html',
          rate: [ true, true, false, false, false ],
          product: {
            urlOfTitle: 'http://www.toranoana.jp/mailorder/article/04/0030/59/82/040030598295.html',
            urlOfCircle: 'http://www.toranoana.jp/cgi-bin/R2/d_search.cgi?bl_fg=0&item_kind=0401&mak=O%2eRIginal%20brand&img=1&stk=1&makAg=1&p1=63&p2=07&p3=5730303230373633',
            srcOfThumbnail: 'http://img.toranoana.jp/img18/04/0030/59/82/040030598295-1r.gif',
            title: 'GALIUSS1',
            circle: 'O.RIginal brand' },
          done: true }, safe(sorted[sorted.length - 1]))
        tt.end()
      })
    })
    t.test('rate == 3', tt => {
      api.getFavsList(3, (err, wrapList) => {
        tt.ok(wrapList.length, list.length / 5, `wrapList.length - ${wrapList.length}`)
        wrapList.map(w => {
          t.deepEqual(w.rate, [!0, !0, !0, !1, !1], safe(w.rate))
        })
        tt.end()
      })
    })

    t.end()
  })

  function setup (f) {
    reads(list.slice(0))
      .on('error', err => console.error(err))
      .on('data', d => d)
      .on('end', f)

    function reads (list) {
      var r = 0
      return missi.from.obj((size, next) => {
        r = (r % 5) + 1
        var p = list.shift()
        if (p == null) return next(null, null)
        api.changeFavsRate(p, r, (err, w) => err ? next(err) : next(null, w))
      })
    }
  }
})

test('api.wrapList(list, cb(err, wrapList)', t => {
  var api = new StorageAPI(storages, {rate: 5})
  api.wrapList(list.slice(0), (err, wrapList) => {
    t.is(wrapList.length, list.length, `wrapList.length ${wrapList.length}`)
    t.is(wrapList[0].id, list[0].urlOfTitle, `wrapList[0].id ${wrapList[0].id}`)
    t.deepEqual(wrapList[0].product, list[0], `wrapList[0].product ${safe(wrapList[0].product)}`)
    t.is(wrapList[0].done, true, `wrapList[0].done ${wrapList[0].done}`)
    t.is(wrapList[0].rate.length, 5, `wrapList[0].rate ${wrapList[0].rate}`)
    t.end()
  })
})

// test('storages', t => {
//   storages.favs.put('hoge', 5, err => {
//     err && console.error(err)
//     t.notOk(err, 'no exists error')
//     storages.favs.get('hoge', (err, rate) => {
//       err && console.error(err)
//       t.notOk(err, 'no exists error')
//       t.is(rate, '5', 'rate eq "5"')
//       storages.favs.del('hoge', err => {
//         t.notOk(err, 'no exists error')
//         storages.favs.get('hoge', (err, rate) => {
//           t.ok(err.notFound, 'ok err.notFound')
//           t.end()
//         })
//       })
//     })
//   })
// })
