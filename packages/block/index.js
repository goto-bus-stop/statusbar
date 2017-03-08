const coreOptions = [
  'color',
  'background'
]

const events = [
  'click',
  'rightclick',
  'middleclick',
  'mouseup',
  'mousedown',
]

module.exports = function createBlock (descr) {
  return (options = {}) => (bar) => {
    if (typeof descr.options === 'function') {
      options = descr.options(options)
    } else {
      options = Object.assign({}, descr.options || {}, options)
    }

    bar.add(descr.name, (b) => {
      let interval

      coreOptions.forEach((name) => {
        if (name in options) b[name] = options[name]
      })

      events.forEach((name) => {
        if (options[`on${name}`]) b.on(name, options[`on${name}`])
      })

      if (descr.init) {
        descr.init(b, options)
      }

      if (descr.interval) {
        // Allow `interval` option if this is an interval block.
        interval = setInterval(run, options.interval || descr.interval)
      }

      run()

      return dispose

      function run () {
        descr.run(b, options)
      }

      function dispose () {
        if (interval) clearInterval(interval)
        if (descr.dispose) descr.dispose(b, options)
      }
    })
  }
}
