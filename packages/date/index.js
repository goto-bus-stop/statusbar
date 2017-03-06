const defaultOptions = {}

module.exports = (options = {}) => (bar) => {
  options = Object.assign({}, defaultOptions, options)

  bar.add('date', (block) => {
    function update () {
      block.update(new Date().toLocaleString())
    }

    update()

    let interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  })
}
