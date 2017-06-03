const spawn = require('child_process').spawn
const through = require('through2')
const duplexify = require('duplexify')
const dzen2 = require('dzen2')

const defaultOptions = {
  spawn: true,
  events: true,
  font: 'monospace',
  align: 'right'
}

function padding (px, text) {
  // Use rectangles for padding so the background colour continues.
  return `^r(${px}x0)${text}^r(+${px}x0)`
}

// Create a `dzen2()` compatible stream that outputs to stdout instead.
function stdio () {
  const output = through(function (chunk, enc, cb) {
    cb(null, chunk + '\n')
  })
  output.pipe(process.stdout)
  const input = process.stdin

  const stream = duplexify(output, input)
  stream.exit = () => {
    output.write('^exit()')
  }
  return stream
}

module.exports = (options = {}) => (bar) => {
  options = Object.assign({}, defaultOptions, options)

  if (options.color) {
    options.foreground = options.color
  }

  const dz = options.spawn
    ? dzen2(options)
    : stdio(options)

  const separator = `^p(;_TOP)^bg(#666666)^r(1x0)^bg()`

  /**
   * Add an action handler to the given dzen2 string.
   *
   * @param {number} button
   * @param {Object} block
   * @param {string} text
   */
  function addAction (button, block, text) {
    return `^ca(${button}, emit(button, ${button}, ${block.instance}))${text}^ca()`
  }

  /**
   * Serialize a block formatted according to the i3bar protocol to a
   * dzen2-compatible string.
   *
   * @param {Object} block
   * @return {string}
   */
  function serializeBlock (block) {
    let result = padding(4, block.full_text)

    // Style
    if (block.color) result = `^fg(${block.color})${result}^fg()`
    if (block.background) result = `^bg(${block.background})${result}^bg()`

    // Events
    if (block._onclick) result = addAction(1, block, result)
    if (block._onrightclick) result = addAction(2, block, result)
    if (block._onmiddleclick) result = addAction(3, block, result)
    if (block._onscrollup) result = addAction(4, block, result)
    if (block._onscrolldown) result = addAction(5, block, result)

    return result
  }

  /**
   * Output a status bar.
   *
   * @param {Array<Object>} chunk A status bar.
   */
  function onoutput (chunk) {
    const text = chunk.map(serializeBlock).join(separator)

    dz.write(text)
  }

  bar.output.on('data', onoutput)
  dz.on('button', (button, id) => {
    bar.input.write({ button: parseInt(button, 10), instance: id })
  })

  bar.on('dispose', () => {
    dz.exit()
  })
}
