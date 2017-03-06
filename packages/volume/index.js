const block = require('@statusbar/block')
const loudness = require('loudness')

module.exports = block({
  name: 'volume',

  options: {
    mute: '🔇',
    low: '🔈',
    mid: '🔉',
    loud: '🔊'
  },

  interval: 1000,

  run (b, options) {
    loudness.getMuted((err, muted) => {
      if (!err && muted) {
        return b.update(`${options.mute} 0%`)
      }

      updateVolume()
    })

    function updateVolume () {
      loudness.getVolume((err, volume) => {
        if (err) return

        let icon = options.low
        if (volume > 30) icon = options.mid
        if (volume > 66) icon = options.loud
        b.update(`${icon} ${volume}%`)
      })
    }
  }
})
