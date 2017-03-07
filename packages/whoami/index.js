const block = require('@statusbar/block')
const username = require('username')

module.exports = block({
  name: 'whoami',

  run (b) {
    username().then(b.update)
  }
})
