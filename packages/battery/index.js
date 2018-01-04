const block = require('@statusbar/block')
// Sorry, not-linux!
const getBattery = require('linux-battery')

module.exports = block({
  name: 'battery',

  interval: 5000,

  init (b, options) {
    b.update('🔋')
  },

  run (b, options) {
    getBattery().then((list) => list[0]).then((battery) => {
      if (battery.state === 'charging') {
        b.update(`🗲 ${battery.percentage} ${battery.timeToFull || 'UNK'}`)
      } else if (battery.state === 'discharging') {
        b.update(`🔋 ${battery.percentage} ${battery.timeToEmpty || 'UNK'}`)
        const pct = parseInt(battery.percentage.replace(/^%/, ''), 10)
        b.color = getColor(pct)
      } else if (battery.state === 'fully-charged') {
        b.update('🔋 100%')
      }
    }).catch((err) => {
      b.background = 'red'
      b.update(`battery: ${err.message}`)
    })
  }
})

function getColor (remaining) {
  if (remaining < 10) {
    return 'red'
  } else if (remaining < 15) {
    return 'orange'
  }
  return null
}
