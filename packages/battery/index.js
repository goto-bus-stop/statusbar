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
        b.update(`🗲 ${battery.percentage} ${battery.timeToFull}`)
      } else {
        b.update(`🔋 ${battery.percentage} ${battery.timeToEmpty}`)
      }
    })
  }
})
