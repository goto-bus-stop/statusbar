const loudness = require('loudness')

const defaultOptions = {
  mute: '🔇',
  low: '🔈',
  mid: '🔉',
  loud: '🔊'
}

module.exports = (options = {}) => (block) => {
  options = Object.assign({}, defaultOptions, options)

  function update () {
    loudness.getVolume((err, volume) => {
      if (err) return

      let icon = options.mute
      if (volume > 0) icon = options.low
      if (volume > 30) icon = options.mid
      if (volume > 66) icon = options.loud
      block.update(`${icon} ${volume}%`)
    })
  }

  update()

  let interval = setInterval(update, 1000)
  return () => clearInterval(interval)
}
