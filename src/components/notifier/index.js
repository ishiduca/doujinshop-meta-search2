var html = require('buoyancy/html')
var css = require('sheetify')
var prefix = css `
  :host {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 999;
  }

  :host>div {
    cursor: pointer;
    padding: 12px;
  }

  :host .is-info {
    background-color: #ffffaa;
  }
  :host .is-error {
    background-color: #aaffff;
  }
`

module.exports = function (data, actionsUp) {
  if (!data.notifier.message) return html `<section></section>`

  return html `
    <section class=${prefix}>
      <div class=${data.notifier.notifyType} onclick=${onclick}>
        ${data.notifier.name && html `<h3>${data.notifier.name}</h3>`}
       <p>${data.notifier.message}</p>
      </div>
    </section>
  `

  function onclick (e) {
    e.stopPropagation()
    actionsUp('notifier:close')
  }
}
