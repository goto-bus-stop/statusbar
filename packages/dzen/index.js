const spawn = require('child_process').spawn
const split = require('split')

const defaultOptions = {
  font: 'monospace',
  align: 'r'
}

function padding (px, text) {
  // Use rectangles for padding so the background colour continues.
  return `^r(${px}x0)${text}^r(+${px}x0)`
}

module.exports = (options = {}) => (bar) => {
  options = Object.assign({}, defaultOptions, options)

  // Base options.
  const args = [
    '-fn', options.font,
    '-ta', options.align
  ]

  // Optional options.
  const extras = {
    fg: options.color,
    bg: options.background,
    x: options.x,
    y: options.y,
    h: options.height,
    w: options.width
  }

  Object.keys(extras).forEach((name) => {
    if (extras[name] != null) {
      args.push(`-${name}`, String(extras[name]))
    }
  })

  const dz = spawn('dzen2', args)

  const separator = `^p(;_TOP)^bg(#666666)^r(1x0)^bg()`

  /**
   * Process an incoming action.
   *
   * Actions come in as button,block pairs, eg:
   *
   *   "1 1" is a left click on block #1
   *   "2 7" is a right click on block #7
   *
   * @param {string} chunk
   */
  function oninput (chunk) {
    const [button, id] = chunk.split(' ')
    bar.input.write({ button: parseInt(button, 10), instance: id })
  }

  /**
   * Add an action handler to the given dzen2 string.
   *
   * @param {number} button
   * @param {Object} block
   * @param {string} text
   */
  function addAction (button, block, text) {
    return `^ca(${button},echo ${button} ${block.instance})${text}^ca()`
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

    dz.stdin.write(text + '\n')
  }

  bar.output.on('data', onoutput)
  dz.stdout.pipe(split()).on('data', oninput)

  bar.on('dispose', () => {
    dz.kill('SIGTERM')
  })
}
