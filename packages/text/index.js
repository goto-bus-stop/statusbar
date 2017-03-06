const block = require('@statusbar/block')

module.exports = block({
  name: 'text',
  options (options) {
    return typeof options === 'object' ? options : { text: options }
  },

  run (b, options) {
    b.update(options.text)
  }
})
