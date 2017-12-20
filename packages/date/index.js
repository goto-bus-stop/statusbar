const format = require('fecha').format
const block = require('@statusbar/block')

module.exports = block({
  name: 'date',
  interval: 1000,
  options (options) {
    if (typeof options === 'string') {
      options = { format: options }
    }

    return Object.assign({
      format: 'YYYY-MM-DD HH:mm:ss'
    }, options)
  },

  run (b, options) {
    b.update(format(new Date(), options.format))
  }
})
