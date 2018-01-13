var xtend = require('xtend')
var missi = require('mississippi')
var afterAll = require('after-all')

module.exports = Storage

function Storage (storages, opt) {
  this.storages = storages
  this.opt = xtend(opt)
  var r = Number(this.opt.rate || 0)
  var a = []
  while (r) { a.unshift(r--) }
  this.opt.rate = a
}

function genID (product) { return product.urlOfTitle }

Storage.prototype.wrapList = function (list, cb) {
  var lst = []
  from(this, list)
    .once('error', cb)
    .on('data', wrapProduct => (lst.push(wrapProduct)))
    .once('end', () => cb(null, lst))

  function from (api, list) {
    return missi.from.obj((size, next) => {
      var p = list.shift()
      if (p == null) return next(null, null)

      var id = genID(p)
      var wrapProduct = {
        id: id,
        product: p
      }
      var n = afterAll(err => {
        if (err && !err.notFound) return next(err)
        next(null, wrapProduct)
      })

      api.storages.done.get(id, n((e, isDone) => (wrapProduct.done = !!isDone)))
      api.storages.favs.get(id, n((e, rate) => (wrapProduct.rate = api.rateToArray(rate || 0))))
    })
  }
}

Storage.prototype.toggleDone = function (product, cb) {
  var id = genID(product)
  var wrapProduct = {id: id}

  this.storages.done.get(id, (err, isDone) => {
    if (err && !err.notFound) return cb(err)
    isDone = !isDone

    var next = afterAll(err => {
      if (err && !err.notFound) return cb(err)
      cb(null, wrapProduct)
    })

    if (isDone) {
      this.storages.done.put(id, isDone, next(e => (wrapProduct.done = isDone)))
      this.storages.product.put(id, product, next(e => (wrapProduct.product = product)))
      this.storages.favs.get(id, next((e, rate) => (wrapProduct.rate = this.rateToArray(rate || 0))))
    } else {
      this.storages.done.del(id, next(e => (wrapProduct.done = isDone)))
      var f = next()
      this.storages.favs.get(id, (err, rate) => {
        if (err && !err.notFound) return err
        wrapProduct.rate = this.rateToArray(rate || 0)
        wrapProduct.product = product
        wrapProduct.done = isDone

        if (rate) {
          this.storages.product.put(id, product, e => f())
        } else {
          this.storages.product.del(id, e => f())
        }
      })
    }
  })
}

Storage.prototype.changeFavsRate = function (product, rate, cb) {
  rate = parseInt(rate, 10)
  if (isNaN(rate)) rate = 0

  var id = genID(product)
  var wrapProduct = {
    id: id,
    product: product,
    rate: this.rateToArray(rate)
  }

  var next = afterAll(err => {
    if (err && !err.notFound) return cb(err)
    cb(null, wrapProduct)
  })

  if (rate) {
    this.storages.favs.put(id, rate, next(e => (null)))
    this.storages.product.put(id, product, next(e => (null)))
    this.storages.done.get(id, next((e, isDone) => (wrapProduct.done = !!isDone)))
  } else {
    this.storages.favs.del(id, next(e => (null)))
    var f = next()
    this.storages.done.get(id, (err, isDone) => {
      if (err && !err.notFound) return err
      wrapProduct.done = (isDone = !!isDone)

      if (isDone) {
        this.storages.product.put(id, product, next(e => f()))
      } else {
        this.storages.product.del(id, next(e => f()))
      }
    })
  }
}

Storage.prototype.getDoneList = function (cb) {
  var list = []
  missi.pipe(
    this.storages.done.createKeyStream(),
    missi.through.obj((id, _, done) => {
      var wrapProduct = {
        id: id,
        done: true
      }
      var next = afterAll(err => {
        if (err && !err.notFound) return done(err)
        list.push(wrapProduct)
        done()
      })

      this.storages.product.get(id, next((e, product) => (wrapProduct.product = product)))
      this.storages.favs.get(id, next((e, rate) => (wrapProduct.rate = this.rateToArray(rate || 0))))
    }),
    err => err ? cb(err) : cb(null, list)
  )
}

Storage.prototype.getFavsList = function (rate, cb) {
  rate = Number(rate)
  if (isNaN(rate)) rate = 0

  var list = []
  missi.pipe(
    this.storages.favs.createReadStream(),
    missi.through.obj((p, _, done) => {
      var id = p.key
      var r = Number(p.value)
      var flg = !rate || (rate === r)

      if (!flg) return done()

      var wrapProduct = {
        id: id,
        rate: this.rateToArray(r)
      }
      var next = afterAll(err => {
        if (err && !err.notFound) return done(err)
        list.push(wrapProduct)
        done()
      })

      this.storages.product.get(id, next((e, product) => (wrapProduct.product = product)))
      this.storages.done.get(id, next((e, isDone) => (wrapProduct.done = !!isDone)))
    }),
    err => err ? cb(err) : cb(null, list)
  )
}

Storage.prototype.rateToArray = function (rate) {
  return this.opt.rate.map(n => (n <= rate))
}
