const loudness = require('loudness')

const defaultOptions = {
  mute: '🔇',
  low: '🔈',
  mid: '🔉',
  loud: '🔊'
}

module.exports = (options = {}) => (bar) => {
  options = Object.assign({}, defaultOptions, options)

  bar.add('volume', (block) => {
    function update () {
      loudness.getMuted((err, muted) => {
        if (err) return
        if (muted) {
          return block.update(`${options.mute} 0%`)
        }

        updateVolume()
      })
    }

    function updateVolume () {
      loudness.getVolume((err, volume) => {
        if (err) return

        let icon = options.low
        if (volume > 30) icon = options.mid
        if (volume > 66) icon = options.loud
        block.update(`${icon} ${volume}%`)
      })
    }

    update()

    let interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  })
}
