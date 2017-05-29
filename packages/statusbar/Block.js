const EventEmitter = require('events').EventEmitter
const colorNames = require('color-name')

function hexByte (n) {
  return n > 0x0F ? n.toString(16) : `0${n.toString(16)}`
}
function hex (color) {
  // rebeccapurple
  if (colorNames[color]) {
    return '#' + colorNames[color].map(hexByte).join('')
  }
  // #ABC → #AABBCC
  if (/^#[0-9A-F]{3}$/i.test(color)) {
    return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
  }
  // #abcdef, hopefully
  return color
}

function Block ({ name, id, create }, bar) {
  const block = new EventEmitter()
  block.name = name
  block.id = id
  block.background = null
  block.color = null

  let currentValue
  let disposer

  function update (value) {
    if (value === currentValue) {
      return
    }
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
      _onmiddleclick: block.listenerCount('middleclick') > 0,
      _onscrollup: block.listenerCount('scrollup') > 0,
      _onscrolldown: block.listenerCount('scrolldown') > 0
    }

    if (block.background) result.background = hex(block.background)
    if (block.color) result.color = hex(block.color)

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
