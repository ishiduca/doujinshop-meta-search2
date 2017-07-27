var html = require('buoyancy/html')
var css = require('sheetify')

var prefix = css `
  :host {
    width: 240px;
    text-align: center;
    margin: 6px;
  }
  :host img {
    max-width: 200px;
  }
  :host .meta {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
`

module.exports = function (o, data, actionsUp) {
  return html `
    <div class=${prefix}>
      <div>
        <figure>
          <a
            href=${o.product.urlOfTitle}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src=${o.product.srcOfThumbnail} />
          </a>
        </figure>
      </div>
      <div>
          <a
            href=${o.product.urlOfTitle}
            target="_blank"
            rel="noopener noreferrer"
          >
            ${o.product.title}
          </a>
          <span> | </span>
          ${
            (o.product.urlOfCircle)
              ? (html `<a
                  href=${o.product.urlOfCircle}
                  target="_blank"
                  rel="noopener noreferrer"
                 >
                   ${o.product.circle}
                 </a>`)
              : (html `<span>${o.product.circle}</span>`)
          }
      </div>
      <div class="meta">
        ${check(o, actionsUp)}
        <div>||</div>
        ${trash(o, actionsUp)}
        <div>:</div>
        ${rate(o, 0, actionsUp)}
        ${rate(o, 1, actionsUp)}
        ${rate(o, 2, actionsUp)}
        ${rate(o, 3, actionsUp)}
        ${rate(o, 4, actionsUp)}
      </div>
    </div>
  `
}

var prefixButton = css `
  :host {}
  :host a {
    display: inline-block;
    padding: 3px;
    border-radius: .8em;
  }
  :host a:hover {
    background-color: #ffaa77;
  }
  :host .onmouseover {
    color: #ff7755;
  }
`

function check (o, actionsUp) {
  var cls = ['fa']
  if (o.meta.done) cls.push('fa-check-square-o')
  else cls.push('fa-square-o')

  return html `
    <div class=${prefixButton}>
      <a
        href="javascript:void(0)"
        onclick=${e => actionsUp('storage:toggleDone', o.product)}
      >
        <i class=${cls.join(' ')}></i>
      </a>
    </div>
  `
}

function rate (o, index, actionsUp) {
  var cls = ['fa']
  if (o.meta.favs[index]) cls.push('fa-star')
  else cls.push('fa-star-o')
  if (o.onmouseover.favs[index]) cls.push('onmouseover')

  return html `
    <div class=${prefixButton}>
      <a
        href="javascript:void(0)"
        onclick=${e => actionsUp('storage:addFavs', o.product, index + 1)}
        onmouseover=${e => {
          e.stopPropagation()
          actionsUp('storeMetaSearch:onFavsMouseOver', [o, index])
          actionsUp('storeSublist:onFavsMouseOver', [o, index])
        }}
        onmouseout=${e => {
          e.stopPropagation()
          actionsUp('storeMetaSearch:onFavsMouseOut', o)
          actionsUp('storeSublist:onFavsMouseOut', o)
        }}
      >
        <i class=${cls.join(' ')}></i>
      </a>
    </div>
  `
}

function trash (o, actionsUp) {
  return html `
    <div class=${prefixButton}>
      <a
        href="javascript:void(0)"
        onclick=${e => actionsUp('storage:removeFavs', o.product)}
      >
       <i class="fa fa-trash"></i>
      </a>
    </div>
  `
}
