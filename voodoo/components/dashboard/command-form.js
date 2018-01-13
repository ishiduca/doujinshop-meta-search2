var yo = require('yo-yo-with-proxy/html')
var empty = require('../empty')
var css = require('sheetify')
var prefix = css`
  :host {
    z-index: 999;
    position: fixed;
    top: 0;
    width: 100vw;
    padding: .8rem;
    background-color: rgba(0, 0, 0, .6);
  }
`

module.exports = function (proxy, p, actionsUp) {
  return yo`
    <section id="command-form-section" class=${prefix}>
      ${commandButtons(proxy, p.buttons, actionsUp)}
      <form onsubmit=${e => actionsUp('command:parse', e)}>
        <input
          type="text"
          class="input"
          placeholder='ex:":act 江田"'
          required
          autofocus
          value=${proxy.input}
          oninput=${e => actionsUp('dom:changeInputValue', e)}
        />
      </form>
      ${empty(proxy.commandErrors, () => commandErrors(proxy, actionsUp))}
    </section>
  `
}

function commandButtons (proxy, buttons, actionsUp) {
  return yo`
    <div class="buttons">
      ${buttons.map(b => yo`
        <a
          class="button"
          onclick=${e => onclick(e, b)}
        >
          ${b.content}
        </a>
      `)}
    </div>
  `

  function onclick (e, b) {
    e.stopPropagation()
    e.preventDefault()
    actionsUp(b.command, b.params)
  }
}

function commandErrors (proxy, actionsUp) {
  return yo`
    <ol>
      ${proxy.commandErrors.map(err => yo`
        <li>
          <p class="has-text-danger">
            <b>${err.name || err.field || 'ERROR'}</b>
            : ${err.message}
          </p>
        </li>
      `)}
    </ol>
  `
}
