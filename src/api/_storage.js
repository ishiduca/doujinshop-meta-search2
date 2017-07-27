var xtend = require('xtend')
var missi = require('mississippi')
var levelup = require('levelup')
var dbHead = 'doozin'
var opt = {db: require('localstorage-down')}
var optProducts = xtend(opt, {valueEncoding: 'json'})

module.exports = StorageModel

function StorageModel (emitter) {
  this.emitter = emitter
  this.dbs = {
    done: levelup(`${dbHead}.done`, opt),
    favs: levelup(`${dbHead}.favs`, opt),
    products: levelup(`${dbHead}.products`, optProducts)
  }
}

// {
//   id: id,
//   meta: {
//     done: 1 | 0,
//     favs: [1, 1, 1, 0, 0]
//   },
//   onmouseover: {
//     done: true | false,
//     trash: true | false,
//     favs: [1, 1, 1, 1, 0]
//   },
//   product: {
//     id: id,
//     title: title,
//     circle: circle,
//     urlOfTitle: urlOfTitle,
//     urlOfCircle: urlOfCircle,
//     srcOfThumbnail: srcOfThumbnail
//   }
// }

function onGetHook (cb, onError) {
  return function (err, a) {
    if (err && !err.notFound) onError(err)
    else cb(a)
  }
}

function onHook (cb, onError) {
  return function (err, a) {
    if (err) onError(err)
    else cb(a)
  }
}

StorageModel.prototype.metaSearch = function (result) {
  var ps = result.response.list.map(p => {
    return new Promise((resolve, reject) => {
      var o = createItem(p)

      this.dbs.products.get(o.id, onGetHook(_p => {
        if (!_p) return resolve(o)
        this.dbs.done.get(o.id, onGetHook(isDone => {
          if (isDone) o.meta.done = 1
          this.dbs.favs.get(o.id, onGetHook(favsRate => {
            o.meta.favs = genFavs(favsRate)
            resolve(o)
          }, reject))
        }, reject))
      }, reject))
    })
  })

  Promise.all(ps).then(products => {
    result.response.list = products.filter(Boolean)
    this.emitter.emit('storeMetaSearch:onMetaSearch', result)
  }).catch(err => this.emitter.emit('error', err))
}

StorageModel.prototype.toggleDone = function (product) {
  var me = this
  var id = product.urlOfTitle

  this.dbs.done.get(id, onGetHook(isDone => {
    if (isDone) clear()
    else {
      this.dbs.done.put(id, 1, onHook(() => {
        this.dbs.products.put(id, product, onHook(() => {
          onDone(1)
        }, onError))
      }, onError))
    }
  }, onError))

  function clear () {
    me.dbs.done.del(id, onHook(() => {
      me.dbs.favs.get(id, onGetHook(favsRate => {
        if (favsRate) onDone(0)
        else {
          me.dbs.products.del(id, onHook(() => {
            onDone(0)
          }, onError))
        }
      }, onError))
    }, onError))
  }

  function onDone (isDone) {
    me.emitter.emit('storeMetaSearch:toggleDone', {
      id: id,
      meta: {done: isDone}
    })
    me.emitter.emit('storeSublist:toggleDone', {
      id: id,
      meta: {done: isDone}
    })
    me.emitter.emit('notifier:notif', {
      message: `storage:toggleDone "notDone" - ${JSON.stringify(product)}`
    })
  }

  function onError (err) {
    me.emitter.emit('error', err)
  }
}

StorageModel.prototype.addFavs = function (product, newRate) {
  var me = this
  var rate = Number(newRate)
  var id = product.urlOfTitle

  if (rate === 0) return this.removeFavs(product)

  this.dbs.favs.put(id, rate, onHook(() => {
    this.dbs.products.put(id, product, onHook(() => {
      this.emitter.emit('storeMetaSearch:addFavs', {
        id: id,
        meta: {favs: genFavs(rate)}
      })
      this.emitter.emit('storeSublist:addFavs', {
        id: id,
        meta: {favs: genFavs(rate)}
      })
      this.emitter.emit('notifier:notif', {
        message: `storage:addFavs "${rate}" - ${JSON.stringify(product)}`
      })
    }, onError))
  }, onError))

  function onError (err) { me.emitter.emit('error', err) }
}

StorageModel.prototype.removeFavs = function (product) {
  var me = this
  var id = product.urlOfTitle
  this.dbs.favs.del(id, onHook(() => {
    this.dbs.done.get(id, onGetHook(isDone => {
      if (!isDone) clear()
      else onDone()
    }, onError))
  }, onError))

  function onDone () {
    me.emitter.emit('storeMetaSearch:addFavs', {
      id: id,
      meta: {favs: genFavs()}
    })
    me.emitter.emit('storeSublist:addFavs', {
      id: id,
      meta: {favs: genFavs()}
    })
    me.emitter.emit('notifier:notif', {
      message: `storage:removeFavs - ${JSON.stringify(product)}`
    })
  }

  function clear () {
    me.dbs.products.del(id, onHook(() => {
      onDone()
    }, onError))
  }

  function onError (err) {
    me.emitter.emit('error', err)
  }
}

StorageModel.prototype.getFavsList = function (rate) {
  var me = this
  var b = []
  missi.pipe(
    this.dbs.favs.createReadStream(),
    missi.through.obj((p, _, done) => {
      var id = p.key
      var favsRate = Number(p.value)

      if (rate === 0 || rate == null) {
        help()
      } else {
        if (rate === favsRate) help()
        else done()
      }

      function help () {
        me.dbs.products.get(id, onGetHook(p => {
          var o = createItem(p)
          o.meta.favs = genFavs(favsRate)

          me.dbs.done.get(id, onGetHook(isDone => {
            if (isDone) o.meta.done = 1
            b.push(o)
            done()
          }, done))
        }, done))
      }
    }),
    err => {
      if (err) this.emitter.emit('error', err)
      else this.emitter.emit('storeSublist:onGetFavsList', {rate: rate, list: b})
    }
  )
}

StorageModel.prototype.getDoneList = function () {
  var b = []
  missi.pipe(
    this.dbs.done.createKeyStream(),
    missi.through.obj((id, _, done) => {
      this.dbs.products.get(id, onGetHook(p => {
        if (!p) return

        var o = createItem(p)
        o.meta.done = 1

        this.dbs.favs.get(id, onGetHook(favsRate => {
          if (favsRate) o.meta.favs = genFavs(Number(favsRate))
          b.push(o)
          done()
        }, done))
      }, done))
    }),
    err => {
      if (err) this.emitter.emit('error', err)
      else this.emitter.emit('storeSublist:onGetDoneList', b)
    }
  )
}

function createItem (p) {
  return {
    id: p.urlOfTitle,
    product: xtend(p),
    meta: {
      done: 0,
      favs: genFavs()
    },
    onmouseover: {
      done: false,
      trash: false,
      favs: genFavs()
    }
  }
}

function genFavs (n) {
  if (n == null) n = 0
  var favs = []
  for (var i = 0; i < 5; i++) {
    favs[i] = (i < n) ? 1 : 0
  }
  return favs
}
