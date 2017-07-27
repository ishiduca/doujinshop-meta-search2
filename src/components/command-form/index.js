var html = require('buoyancy/html')
var css = require('sheetify')

var prefix = css `
  :host {
  }
  :host input {
    width: 100%;
    box-shadow: none;
    font-size: medium;
    line-height: 1.2em;
  }
  :host input:focus {
    outline: #77aaff;
  }
  :host input:hover {
    opacity: 1;
  }
`

var id = 'command'

module.exports = function (data, actionsUp) {
  var $inp = html `
    <input
      id=${id}
      type="search"
      required
      placeholder=${data.commandForm.placeholder}
      value=${data.commandForm.input}
      oninput=${e => actionsUp('commandForm:input', e.target.value)}
    />
  `

  return html `
    <section class=${prefix}>
      <form onsubmit=${onsubmit}>${$inp}</form>
    </section>
  `

  function onsubmit (e) {
    e.preventDefault()
    actionsUp('parser:parse', $inp.value)
    actionsUp('commandForm:input', '')
  }
}
