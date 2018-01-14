var yo = require('yo-yo-with-proxy/html')
var empty = require('../empty')
var css = require('sheetify')
var prefix = css`
  :host {
    margin: 3rem;
  }
  :host img {
    max-width: 218px;
  }
  :host .media-box {
    background-color: #ffffff;
    border-radius: 5px;
    border: solid 1px #cccccc;
    display: block;
    padding: .75em;
    width: 246px;
  }
  :host .media-box>figure {
    text-align: center;
  }
  :host header {
    padding: .75rem;
  }
  :host>header {
    text-align: center;
  }
`

module.exports = function (proxy, actionsUp) {
  return empty(proxy.resultMetaSearch, () => yo`
    <main id="result-meta-search-section" class=${prefix}>
      <header>
        <h2 class="title is-2">${proxy.resultMetaSearch.query}</h2>
      </header>
      ${proxy.resultMetaSearch._.map(o => yo`
        <article>
          <header>
            <h4 class="title is-4">${o.service} (${o.list.length})</h4>
            ${empty(o.request, () => yo`
              <p>
                ${link(o.request, o.request)}
              </p>
            `)}
          </header>
          ${o.list.length
            ? yo`
              <ul class="columns is-mobile is-multiline">
                ${o.list.map(w => yo`
                  <li class="column">
                    <div class="media-box">
                      <figure>
                        ${link(
                          w.product.urlOfTitle,
                          yo`<img src=${w.product.srcOfThumbnail} />`
                        )}
                        <p>
                          ${link(w.product.urlOfTitle, w.product.title)}
                          <span> [ </span>
                          ${w.product.urlOfCircle
                            ? link(w.product.urlOfCircle, w.product.circle)
                            : yo`<span>${w.product.circle}</span>`
                          }
                          <span> ] </span>
                        </p>
                      </figure>
                      <div>
                        ${w.done
                          ? icon('fa fa-check-square-o', e => actionsUp('storage:toggleDone', w.product, proxy.resultMetaSearch.query))
                          : icon('fa fa-square-o', e => actionsUp('storage:toggleDone', w.product, proxy.resultMetaSearch.query))
                        }
                        <span>:</span>
                        ${w.rate.map((r, i) => (
                          r ? icon('fa fa-star', e => actionsUp('storage:changeFavsRate', w.product, (i + 1), proxy.resultMetaSearch.query))
                            : icon('fa fa-star-o', e => actionsUp('storage:changeFavsRate', w.product, (i + 1), proxy.resultMetaSearch.query))
                        ))}
                        <span>:</span>
                        ${icon('fa fa-trash', e => actionsUp('storage:changeFavsRate', w.product, 0, proxy.resultMetaSearch.query))}
                      </div>
                    </div>
                  </li>
                `)}
              </ul>
            `
            : yo`<div class="container"><h3 class="subtitle is-4">none :(</h3></div>`
          }
        </article>
      `)}
    </main>
  `)
}

function icon (className, onclick) {
  return yo`
    <a class="icon"
      onclick=${e => {
        e.stopPropagation()
        onclick(e)
      }}
    >
      <i class=${className}></i>
    </a>
  `
}

function link (href, content) {
  return yo`
    <a
      href=${href}
      target="_blank"
      rel="noopener noreferrer"
    >${content}</a>
  `
}
