const spawn = require('child_process').spawn
const split = require('split2')

module.exports = (options = {}) => (bar) => {
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
   * Add an action handler to the given lemonbar string.
   *
   * @param {number} button
   * @param {Object} block
   * @param {string} text
   */
  function addAction (button, block, text) {
    return `%{A${button}:${button} ${block.instance}:}${text}%{A}`
  }

  /**
   * Serialize a block formatted according to the i3bar protocol to a
   * lemonbar-compatible string.
   *
   * @param {Object} block
   * @return {string}
   */
  function serializeBlock (block) {
    let result = ` ${block.full_text} `

    // Style
    if (block.color) result = `%{F${block.color}}${result}%{F-}`
    if (block.background) result = `%{B${block.background}}${result}%{B-}`

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

    process.stdout.write(text + '\n')
  }

  bar.output.on('data', onoutput)
  process.stdin.pipe(split()).on('data', oninput)
}
