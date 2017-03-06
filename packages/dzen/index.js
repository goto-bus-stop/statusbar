const spawn = require('child_process').spawn
const split = require('split')

const defaultOptions = {
  font: 'monospace',
  align: 'r'
}

module.exports = (options = {}) => (bar) => {
  options = Object.assign({}, defaultOptions, options)

  const dz = spawn('dzen2', [
    '-fn', options.font,
    '-ta', options.align
  ])

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
    let result = block.full_text

    // Style
    if (block.color) result = `^fg(${block.color})${result}^fg()`
    if (block.background) result = `^bg(${block.background})${result}^bg()`

    // Events
    if (block._onclick) result = addAction(1, block, result)
    if (block._onrightclick) result = addAction(2, block, result)

    return result
  }

  /**
   * Output a status bar.
   *
   * @param {Array<Object>} chunk A status bar.
   */
  function onoutput (chunk) {
    const text = chunk.map(serializeBlock).join(' | ')

    dz.stdin.write(text + '\n')
  }

  bar.output.on('data', onoutput)
  dz.stdout.pipe(split()).on('data', oninput)
}
