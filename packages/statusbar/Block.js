const EventEmitter = require('events').EventEmitter

function Block ({ name, id, create }, bar) {
  const block = new EventEmitter()
  block.name = name
  block.id = id
  block.background = null
  block.color = null

  let currentValue
  let disposer

  function update (value) {
    currentValue = value
    bar.update()
  }

  function get () {
    const result = {
      name,
      instance: id,
      full_text: currentValue,
      _onclick: block.listenerCount('click') > 0,
      _onrightclick: block.listenerCount('rightclick') > 0,
    }

    if (block.background) result.background = block.background
    if (block.color) result.color = block.color

    return result
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
