var missi = require('mississippi')
var xtend = require('xtend')
var afterAll = require('after-all')

module.exports = function (opt) {
  return {
    search: search,
    metasearch: metasearch,
    listupQueries: listupQueries
  }

  function genKey (p) {
    return `${p.category}:${p.value.toLowerCase()}`
  }

  function listupQueries (params) {
    return new Promise((resolve, reject) => {
      var list = []
      missi.pipe(
        opt.dbs.request.createReadStream(),
        missi.through.obj((pair, _, done) => {
          list.push(pair)
          done()
        }),
        err => {
          if (err) return reject(err)
          resolve(list.sort((a, b) => {
            var av = Number(a.value)
            var bv = Number(b.value)
            return (av < bv) ? 1 : (av > bv) ? -1 : 0
          }))
        }
      )
    })
  }

  function metasearch (params) {
    addCount(params, (err, q) => {
      if (err) return console.error(err)
      else console.log(`[dbs.request]:count "${q.key}" => ${q.count}`)
    })

    var query = genKey(params)
    var reads = missi.through.obj()
    var next = afterAll(e => (reads.end()))

    Object.keys(opt.services).map(name => {
      var service = opt.services[name]
      var s = service.createStream()
      var cb = next()
      missi.pipe(
        s, missi.through.obj((result, _, done) => {
          reads.write(xtend(result, {query: query}))
          done()
        }), err => (err ? reads.emit('error', err) : cb())
      )
      s.end(params)
    })

    return reads
  }

//  function metasearch (params) {
//    addCount(params, (err, q) => {
//      if (err) return console.error(err)
//      else console.log(`[dbs.request]:count "${q.key}" => ${q.count}`)
//    })
//
//    var query = genKey(params)
//    var reads = missi.through.obj()
//    var i = 0
//
//    Object.keys(opt.services).map(name => {
//      var service = opt.services[name]
//      var stream = service.createStream()
//      i += 1
//
//      missi.pipe(
//        stream,
//        missi.through.obj((result, _, done) => {
//          reads.write(xtend(result, {query: query}))
//          done()
//        }),
//        err => {
//          i -= 1
//          if (err) reads.emit('error', err)
//          if (i === 0) reads.end()
//        }
//      )
//
//      stream.end(params)
//    })
//
//    return reads
//  }

  function search (params) {
    addCount(params.params, (err, q) => {
      if (err) return console.error(err)
      else console.log(`[dbs.request]:count "${q.key}" => ${q.count}`)
    })
    return _search(params)
  }

  function _search (params) {
    return new Promise((resolve, reject) => {
      var service = opt.services[params.service]
      var stream = service.createStream()
      var result

      stream.once('error', reject)
      stream.once('data', _result => (result = _result))
      stream.once('end', () => resolve(result))

      stream.end(params.params)
    })
  }

  function addCount (params, f) {
    var key = genKey(params)
    opt.dbs.request.get(key, (err, count) => {
      if (err && !err.notFound) return f(err)
      count = count == null ? 1 : (Number(count) + 1)
      opt.dbs.request.put(key, count, err => {
        f(err, {key: key, count: count})
      })
    })
  }
}
