const defaultOptions = {}

module.exports = (options = {}) => (block) => {
  options = Object.assign({}, defaultOptions, options)

  function update () {
    block.update(new Date().toLocaleString())
  }

  update()

  let interval = setInterval(update, 1000)
  return () => clearInterval(interval)
}
