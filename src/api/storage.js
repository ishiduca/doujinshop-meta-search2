var StorageModel = require('./_storage')

module.exports = function (emitter, getData) {
  var model = new StorageModel(emitter)
  emitter.on('storage:metaSearch', result => model.metaSearch(result))
  emitter.on('storage:toggleDone', product => model.toggleDone(product))
  emitter.on('storage:removeFavs', product => model.removeFavs(product))
  emitter.on('storage:addFavs', (product, newRate) => model.addFavs(product, newRate))
  emitter.on('storage:getDoneList', () => model.getDoneList())
  emitter.on('storage:getFavsList', rate => model.getFavsList(rate))
}
