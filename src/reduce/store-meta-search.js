var xtend = require('xtend')
var indexMetaSearch = []
var storeMetaSearch = {}
// {
//   id: id, // jsonrpc.id
//   title: strTitle,
//   params: {category: '', value: ''},
//   services: [
//     {
//       service: serviceName,
//       request: reuestURL,
//       list: [products]
//     }
//   ]
// }
module.exports = {
  'storeMetaSearch:onMetaSearch' (data, action, update) {
    var req = action.request
    var res = action.response
    var id = req.id
    if (indexMetaSearch.indexOf(id) === -1) {
      indexMetaSearch.push(id)
      storeMetaSearch[id] = {
        id: id,
        title: `${req.params.category}: ${req.params.value}`,
        params: req.params,
        services: [ res ]
      }
    } else {
      var n = storeMetaSearch[id].services.map(m).indexOf(res.service)
      if (n === -1) {
        storeMetaSearch[id].services.push(res)
      } else {
        storeMetaSearch[id].services[n] = res
      }
    }

    update({
      metaSearchResult: xtend(storeMetaSearch[id]),
      metaSearchList: indexMetaSearch.slice(0).reverse().map(mm)
    })

    function m (o) { return o.service }
    function mm (id) {
      return {
        id: id,
        title: storeMetaSearch[id].title
      }
    }
  },
  'storeMetaSearch:addFavs' (data, action, update) {
    chagneMetaData(data, action, update)
  },
  'storeMetaSearch:toggleDone' (data, action, update) {
    chagneMetaData(data, action, update)
  },
  'storeMetaSearch:focus' (data, action, update) {
    update({
      metaSearchResult: xtend(storeMetaSearch[action])
    })
  },
  'storeMetaSearch:onFavsMouseOver' (data, action, update) {
    changeOnFavsMouseOut(data, action, update)
  },
  'storeMetaSearch:onFavsMouseOut' (data, action, update) {
    changeOnFavsMouseOut(data, [action, -1], update)
  }
}

function changeOnFavsMouseOut (data, action, update) {
  find(data, action, p => {
    if (p.id === action[0].id) {
      p.onmouseover = xtend(p.onmouseover, {favs: genFavs(action[1])})
    }
  }, update)
}

function chagneMetaData (data, action, update) {
  find(data, action, p => {
    if (p.id === action.id) {
      p.meta = xtend(p.meta, action.meta)
    }
  }, update)
}

function find (data, action, cb, update) {
  Object.keys(storeMetaSearch).forEach(sid => {
    var o = storeMetaSearch[sid]
    o.services.forEach(s => {
      s.list.forEach(cb)
    })
  })
  update()
}

function genFavs (n) {
  if (n == null) n = 0
  var favs = []
  for (var i = 0; i < 5; i++) {
    favs[i] = (i <= n) ? 1 : 0
  }
  return favs
}
