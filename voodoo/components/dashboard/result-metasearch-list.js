var yo = require('yo-yo-with-proxy/html')
var empty = require('../empty')
var css = require('sheetify')
var prefix = css`
  :host {
    padding: 9rem 3rem;
  }
`

module.exports = function (proxy, actionsUp) {
  return empty(proxy.resultMetaSearchList, () => yo`
    <section id="result-meta-search-list-section" class=${prefix}>
      <div class="buttons">
      ${proxy.resultMetaSearchList.map(q => yo`
        <a class="button is-rounded"
          onclick=${e => actionsUp('storage:getResult', e, q)}
        >
          ${q}
        </a>
      `)}
      </div>
    </section>
  `)
}
