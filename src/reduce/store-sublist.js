var xtend = require('xtend')

module.exports = {
  'storeSublist:onGetDoneList' (data, action, update) {
    update({
      sublist: {
        title: `done (${action.length})`,
        list: action.sort(sort)
      }
    })
  },
  'storeSublist:onGetFavsList' (data, action, update) {
    update({
      sublist: {
        title: `favs: ${action.rate || 'all'} (${action.list.length})`,
        list: action.list.sort(sort)
      }
    })
  },
  'storeSublist:toggleDone' (data, action, update) {
    changeMeta(data, action, update)
  },
  'storeSublist:addFavs' (data, action, update) {
    changeMeta(data, action, update)
  },
  'storeSublist:onFavsMouseOver' (data, action, update) {
    changeOnFavsMouseOut(data, action, update)
  },
  'storeSublist:onFavsMouseOut' (data, action, update) {
    changeOnFavsMouseOut(data, [action, -1], update)
  }
}

function sort (a, b) {
  var aa = a.product.circle
  var bb = b.product.circle
  return (aa > bb) ? 1 : (aa < bb) ? -1 : 0
}

function changeMeta (data, action, update) {
  find(data, action, o => {
    if (o.id === action.id) {
      o.meta = xtend(o.meta, action.meta)
    }
    return o
  }, update)
}

function changeOnFavsMouseOut (data, action, update) {
  find(data, action, o => {
    if (o.id === action[0].id) {
      o.onmouseover = xtend(o.onmouseover, {favs: genFavs(action[1])})
    }
    return o
  }, update)
}

function find (data, action, cb, update) {
  var sublist = {title: data.sublist.title}
  sublist.list = data.sublist.list.map(cb)
  update({sublist: sublist})
}

function genFavs (n) {
  if (n == null) n = 0
  var favs = []
  for (var i = 0; i < 5; i++) {
    favs[i] = (i <= n) ? 1 : 0
  }
  return favs
}
