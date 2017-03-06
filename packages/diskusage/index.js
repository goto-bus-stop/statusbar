const df = require('@sindresorhus/df')
const bytes = require('prettier-bytes')

const defaultOptions = {}

module.exports = (options = {}) => (bar) => {
  if (typeof options === 'string') {
    options = { fs: options }
  }

  options = Object.assign({}, defaultOptions, options)

  bar.add('diskusage', (block) => {
    function update () {
      df.fs(options.fs).then((fs) => {
        block.update(`${fs.mountpoint} ${bytes(fs.available)}`)
      })
    }

    update()

    let interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  })
}
