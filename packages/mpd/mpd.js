const net = require('net')
const split = require('split2')

module.exports = function mpd (opts, update) {
  const sock = net.connect(opts)
  const currentTags = {}
  let shouldIdle = true
  let updateTimer = null
  let statusTimer

  sock.pipe(split()).on('data', (buf) => {
    const line = buf.toString()
    console.log('mpd', line)
    processTags(line)

    if (didPlayerChange(line)) {
      currentsong()
    } else {
      idle()
    }
  })
  sock.once('data', () => {
    statusTimer = setInterval(() => {
      if (isFinite(currentTags.elapsed)) {
        currentTags.elapsed += 1
        updateSoon()
      }
    }, 1000)
  })

  currentsong()

  return () => {
    if (updateTimer) clearTimeout(updateTimer)
    if (statusTimer) clearInterval(statusTimer)
    sock.disconnect()
  }

  function currentsong () {
    sock.write('currentsong\nstatus\n')
    shouldIdle = true
  }
  function processTags (line) {
    const match = /^(Artist|Album|Title|Track|elapsed|duration): (.*?)$/.exec(line)
    if (match) {
      const prop = match[1].toLowerCase()
      let value = match[2]
      if (prop === 'elapsed' || prop === 'duration') {
        value = parseInt(value, 10)
      }
      currentTags[prop] = value
      updateSoon()
    }
  }
  function idle () {
    if (shouldIdle) {
      sock.write('idle\n')
    }
    shouldIdle = false
  }
  function didPlayerChange (line) {
    return line.trim() === 'changed: player'
  }
  function updateSoon () {
    if (updateTimer) return
    updateTimer = setTimeout(() => {
      updateTimer = null
      update(currentTags)
    }, 20)
  }
}
