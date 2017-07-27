var xtend = require('xtend')
module.exports = {
  'commandForm:input' (data, action, update) {
    var commandForm = xtend(data.commandForm)
    commandForm.input = action
    update({commandForm: commandForm})
  }
}
