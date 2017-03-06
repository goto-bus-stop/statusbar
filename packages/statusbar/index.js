const throttle = require('@f/throttle')
const Block = require('./Block')

const defaultOptions = {
  input: process.stdin,
  output: process.stdout
}

function StatusBar (options = {}) {
  const bar = {}
  const blocks = []
  let previousContents

  options = Object.assign({}, defaultOptions, options)

  // Input and output streams can be swapped out at runtime by assigning to
  // the `input` and `output` properties.
  bar.input = options.input
  bar.output = options.output

  /**
   * Add a block to the status bar.
   *
   * @param {*} create A function that initializes the block.
   */
  function use (create) {
    const block = Block(create, bar)
    blocks.push(block)

    return bar
  }

  /**
   * Update the status bar.
   */
  const update = throttle(function update () {
    const next = get()
    if (next !== previousContents) {
      bar.output.write(next)
    }
    previousContents = next
  }, 16)

  /**
   * Get the contents of the status bar.
   */
  function get () {
    return blocks.map((bl) => bl.get()).join(' | ') + '\n'
  }

  /**
   * Dispose.
   */
  function dispose () {
    blocks.forEach((block) => {
      block.dispose()
    })
    blocks.length = 1

    process.off('beforeExit', dispose)
  }

  process.on('beforeExit', dispose)

  return Object.assign(bar, {
    use,
    update,
    get,
    dispose
  })
}

module.exports = StatusBar
