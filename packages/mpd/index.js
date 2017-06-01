const block = require('@statusbar/block')
const mpd = require('./mpd')

function formatDuration (seconds) {
  let formatted = ''
  if (seconds > 3600) {
    formatted += Math.floor(seconds / 3600) + ':'
    seconds -= Math.floor(seconds / 3600)
  }
  return `${formatted}${pad(seconds / 60)}:${pad(seconds % 60)}`

  function pad (n) {
    if (n < 10) return `0${Math.floor(n)}`
    return Math.floor(n)
  }
}

module.exports = block({
  name: 'mpd',

  options (options) {
    options = Object.assign({
      format: '{artist} - {title}',
      port: 6600,
      host: 'localhost'
    }, options)
    return options
  },

  run (b, options) {
    b.unsubscribe = mpd(options, ontags)

    b.update('')
    function ontags (tags) {
      if (tags) {
        let output = options.format.replace(/\{(\w+)\}/g, (_, tag) => {
          if (tag === 'duration' || tag === 'elapsed') {
            return formatDuration(tags[tag] || 0)
          }
          return tags[tag] || '?'
        })
        b.update(output)
      } else {
        b.update('')
      }
    }
  },

  dispose (b) {
    b.unsubscribe()
  }
})
