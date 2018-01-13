module.exports = Notifier

function Notifier (opt) {
  if (!(this instanceof Notifier)) return new Notifier(opt)
  opt || (opt = {})
  this.publisher = null
  this.lock = null
  this.queue = []
  this.interval = opt.interval || 1200
  this.timeout = (opt.timeout || 3600) + this.interval
}

Notifier.prototype.resume = function () {
  if (this.lock) return

  this.lock = setInterval(() => {
    setTimeout(this._publish.bind(this), this.interval)
    this.publisher(null)
  }, this.timeout)

  this._publish()
}

Notifier.prototype._publish = function () {
  var m = this.queue.shift()
  if (!m) this.unlock()
  this.publisher(m || null)
}

Notifier.prototype.unlock = function () {
  clearInterval(this.lock)
  this.lock = null
}

Notifier.prototype.close = function () {
  this.unlock()
  setTimeout(this.resume.bind(this), this.interval)
  this.publisher(null)
}

Notifier.prototype.publish = function (message) {
  if (typeof message === 'string') {
    message = {name: 'info', message: message}
  }
  this.queue.push(message)
  this.resume()
}

Notifier.prototype.subscribe = function (publisher) {
  return (this.publisher = publisher)
}
