const format = require('fecha').format

const defaultOptions = {
  format: 'YYYY-MM-DD hh:mm:ss'
}

module.exports = (options = {}) => (bar) => {
  if (typeof options === 'string') {
    options = { format: options }
  }

  options = Object.assign({}, defaultOptions, options)

  bar.add('date', (block) => {
    function update () {
      block.update(format(new Date(), options.format))
    }

    update()

    let interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  })
}
