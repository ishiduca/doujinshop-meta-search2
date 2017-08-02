module.exports = function (emitter, getData) {
  emitter.on('link', href => {
    var a = document.createElement('a')
    a.setAttribute('href', href)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  })
}
