// Sorry, not-linux!
const getBattery = require('linux-battery')

module.exports = () => (bar) => {
  bar.add('battery', (block) => {
    block.update('🔋')

    function update () {
      getBattery().then((list) => list[0]).then((battery) => {
        if (battery.state === 'charging') {
          block.update(`🗲 ${battery.percentage} ${battery.timeToFull}`)
        } else {
          block.update(`🔋 ${battery.percentage} ${battery.timeToEmpty}`)
        }
      })
    }

    update()

    let interval = setInterval(update, 5000)
    return () => clearInterval(interval)
  })
}
