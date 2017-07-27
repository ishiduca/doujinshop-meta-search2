var html = require('buoyancy/html')
var css = require('sheetify')

var prefix = css `
  :host {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    flex-shrink: 0;
  }
  :host a {
    display: inline-block;
    padding: 3px;
    margin-bottom: 3px;
    background-color: #ffffaa;
    text-decoration: none;
  }
`

module.exports = function (data, actionsUp) {
  return html `
    <section class=${prefix}>
      ${data.metaSearchList.map(o => html `
        <div>
          <a href="javascript:void(0)"
            onclick=${e => {
              e.stopPropagation()
              actionsUp('storeMetaSearch:focus', o.id)
            }}
          >
            ${o.title}
          </a>
        </div>
      `)}
    </section>
  `
}
