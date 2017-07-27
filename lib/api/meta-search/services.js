var missi = require('mississippi')

module.exports = Services

function Services () {
  this.services = [].slice.apply(arguments)
}

Services.prototype.metaSearch = function (params, req) {
  var rs = missi.through.obj()
  var i = 0

  process.nextTick(() => {
    this.services.forEach(service => {
      i += 1
      var s = service.createStream()
      missi.pipe(
        s,
        missi.through.obj(w),
        onEnd
      )
      s.end(params)

      function w (o, _, d) {
        rs.write({
          request: req,
          response: o
        })
        d()
      }

      function onEnd (err) {
        i -= 1
        if (err) rs.emit('error', err)
        if (i === 0) rs.end()
      }
    })
  })

  return rs
}
