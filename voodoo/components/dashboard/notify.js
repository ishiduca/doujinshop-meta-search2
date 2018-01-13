var yo = require('yo-yo-with-proxy/html')
var empty = require('../empty')
var css = require('sheetify')

var prefix = css`
  :host {
    z-index: 999;
    position: fixed;
    bottom: 0;
    width: 100vw;
    cursor: pointer;
  }
`

module.exports = function (proxy, actionsUp) {
  return empty(proxy.notify, () => yo`
    <section
      id="notify-section"
      class=${prefix}
      onclick=${e => actionsUp('notifier:unlock', e)}
    >
      <div class="notification is-info">
        <h2 class="title">${proxy.notify.name || 'info'}</h2>
        <p>${proxy.notify.message}</p>
      </div>
    </section>
  `)
}
