const Readable = require('stream').Readable
const Writable = require('stream').Writable
const EventEmitter = require('events').EventEmitter
const throttle = require('@f/throttle')
const Block = require('./Block')

const defaultOptions = {}

// Map X11 button IDs to event names.
const eventNames = {
  1: 'click',
  2: 'rightclick',
  3: 'middleclick',
  4: 'scrollup',
  5: 'scrolldown'
}

function StatusBar (options = {}) {
  const bar = new EventEmitter()
  const blocks = []

  let previousContents
  let blockId = 0

  options = Object.assign({}, defaultOptions, options)

  const input = new Writable({
    objectMode: true,
    write (chunk, enc, callback) {
      const block = getBlock(chunk.instance)
      const event = eventNames[chunk.button]
      block.emit(event)
      callback()
    }
  })

  const output = new Readable({
    objectMode: true,
    read () { /* Not doing anything… */ }
  })

  bar.input = input
  bar.output = output

  /**
   * Add a plugin.
   */
  function use (fn) {
    fn(bar)

    return bar
  }

  /**
   * Add a block to the status bar.
   *
   * @param {*} create A function that initializes the block.
   */
  function add (name, create) {
    const block = Block({
      name: name,
      id: `${blockId++}`,
      create: create
    }, bar)
    blocks.push(block)

    return block
  }

  /**
   * Update the status bar.
   */
  const update = throttle(function update () {
    const next = get()
    if (next !== previousContents) {
      bar.output.push(next)
    }
    previousContents = next
  }, 16)

  /**
   * Get the contents of the status bar.
   */
  function get () {
    return blocks.map((bl) => bl.get())
  }

  /**
   * Get a block instance by ID.
   *
   * @param {string} id
   */
  function getBlock (id) {
    return blocks.find((bl) => bl.id === id)
  }

  /**
   * Dispose.
   */
  function dispose () {
    blocks.forEach((block) => {
      block.dispose()
    })
    blocks.length = 0

    process.removeListener('beforeExit', dispose)
  }

  process.on('beforeExit', dispose)

  return Object.assign(bar, {
    use,
    add,
    update,
    get,
    getBlock,
    dispose
  })
}

module.exports = StatusBar
