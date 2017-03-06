const EventEmitter = require('events').EventEmitter

function Block ({ name, id, create }, bar) {
  const block = new EventEmitter()
  block.name = name
  block.id = id

  let currentValue
  let disposer

  function update (value) {
    currentValue = value
    bar.update()
  }

  function get () {
    return {
      name,
      instance: id,
      full_text: currentValue
    }
  }

  function dispose () {
    if (disposer) disposer()
  }

  Object.assign(block, {
    update,
    get,
    dispose
  })

  disposer = create(block)

  return block
}

module.exports = Block
