var xtend = require('xtend')
module.exports = {
  'notifier:pump' (data, action, update) {
    update({notifier: xtend(action)})
  },
  'notifier:delete' (data, action, update) {
    update({
      notifier: {
        name: null,
        message: null,
        notifyType: null
      }
    })
  }
}
