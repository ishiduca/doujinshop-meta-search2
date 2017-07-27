var html = require('buoyancy/html')
var css = require('sheetify')

var prefix = css `
   :host {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }
  :host div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }
`

module.exports = function (data, actionsUp) {
  return html `
    <section class=${prefix}>
      ${linkButton('/dummy', 'c')}
      ${linkButton('/command/done', 'done', pushDone)}
      <div>
        <div>favs:</div>
        ${linkButton('/command/favs', 'all', pushFavs, 0)}
        ${linkButton('/command/favs/1', 'i', pushFavs, 1)}
        ${linkButton('/command/favs/2', 'ii', pushFavs, 2)}
        ${linkButton('/command/favs/3', 'iii', pushFavs, 3)}
        ${linkButton('/command/favs/4', 'iv', pushFavs, 4)}
        ${linkButton('/command/favs/5', 'v', pushFavs, 5)}
      </div>
      ${linkButton('/', 'dashboard')}
    </section>
  `

  function pushDone (e) {
    actionsUp('storage:getDoneList')
  }

  function pushFavs (e, rate) {
    actionsUp('storage:getFavsList', rate)
  }
}

var buttonPre = css `
  :host {
    padding: 12px 6px;
  }
  :host a {
    display: inline-block;
    border: 1px solid #aaaaaa;
    padding: .8em;
    border-radius: 1em;
  }
  :host a:hover {
    background-color: #eeffcc;
    border: 1px solid #cceedd;
  }
`

function linkButton (href, text, _onclick, args) {
  if (typeof _onclick === 'function') {
    return html `
      <div class=${buttonPre}>
        <a
          href=${href}
          onclick=${e => _onclick(e, args)}
        >${text}</a>
      </div>
    `
  }
  return html `
    <div class=${buttonPre}>
      <a
        href=${href}
      >${text}</a>
    </div>
  `
}
