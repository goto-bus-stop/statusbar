function Block (create, bar) {
  let currentValue
  let disposer

  function update (value) {
    currentValue = value
    bar.update()
  }

  function get () {
    return currentValue
  }

  function dispose () {
    if (disposer) disposer()
  }

  const block = {
    update,
    get,
    dispose
  }

  disposer = create(block)

  return block
}

module.exports = Block
