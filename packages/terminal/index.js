const colors = require('ansi-256-colors')
const diff = require('ansi-diff-stream')
const map = require('map-stream')

const defaultOptions = {
  output: process.stdout
}

function getColorCode (style, c) {
  const res = c.match(/#(..)(..)(..)/).slice(1)
    .map((n) => parseInt(n, 16))
    .map((n) => Math.floor(n / 0xFF))
  return colors[style].getRgb(...res)
}

module.exports = (options = {}) => (bar) => {
  options = Object.assign({}, defaultOptions, options)

  function serializeBlock (block) {
    let text = ` ${block.full_text} `
    if (block.background) text = getColorCode('bg', block.background) + text
    if (block.color) text = getColorCode('fg', block.color) + text
    if (block.background || block.color) text += colors.reset
    return text
  }

  bar.output
    .pipe(map((line, cb) => {
      cb(null, line.map(serializeBlock).join('|'))
    }))
    .pipe(diff())
    .pipe(options.output)
}
