const block = require('@statusbar/block')
const df = require('@sindresorhus/df')
const bytes = require('prettier-bytes')

module.exports = block({
  name: 'diskusage',
  options (options) {
    if (typeof options === 'string') {
      return { fs: options }
    }
    return options
  },

  interval: 3000,

  run (b, options) {
    df.fs(options.fs).then((fs) => {
      b.update(`${options.label || fs.mountpoint} ${bytes(fs.available)}`)
    })
  }
})
