const block = require('@statusbar/block')
const wifiName = require('wifi-name')
const os = require('os')

function getIp (device, family = 'v4') {
  const intfs = os.networkInterfaces()
  const dev = intfs[device]
  if (!dev) return null

  return dev.find((intf) => intf.family === `IP${family}`).address
}

module.exports = block({
  name: 'wifi',

  options: {
    device: 'wlan0'
  },

  run (b, options) {
    Promise.all([
      wifiName(),
      getIp(options.device, 'v4')
    ]).then((results) => {
      const name = results[0]
      const ip = results[1] || 'No IP'

      if (!name) {
        b.color = 'red'
        b.update('Not connected')
        return
      }

      b.color = null
      b.update(`${name} ${ip}`)
    })
  }
})
