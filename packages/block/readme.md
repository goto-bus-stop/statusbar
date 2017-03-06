# @statusbar/block

Create blocks for [Statusbar](https://github.com/goto-bus-stop/statusbar).

## Usage

```js
// date.js
const block = require('@statusbar/block')

module.exports = block({
  // A unique name for your block.
  name: 'date',

  // Default options.
  options: {
    format: 'YYYY-MM-DD HH:mm:ss'
  },

  // If you provide a function instead, its return value is used as the options
  // instead. This way you can accept non-object values as options:
  options (options) {
    // dateBlock('MM-DD-YYYY HH:mm')
    if (typeof options === 'string') {
      return { format: options }
    }
    // Provide defaults.
    return Object.assign({
      format: 'YYYY-MM-DD HH:mm:ss',
    }, options)
  },

  // If your block needs to update every N seconds, you can provide an interval.
  // This will keep calling your `run` method.
  // Numeric value in milliseconds.
  interval: 1000,

  // If you need to do some initialisation, do it in the `init` method.
  // First argument is the Block, second is the provided options.
  init (b, options) {
  },

  // Run your block.
  // First argument is the Block, second is the provided options.
  run (b, options) {
    b.update(format(new Date(), options.format))
  },

  // Clean up when the status bar is shutting down.
  // First argument is the Block, second is the provided options.
  dispose (b, options) {
  }
})
```

Now, this block can be used as:

```js
const date = require('./date.js')
bar.use(date())
// or
bar.use(date({ interval: 2000 }))
// or
bar.use(date('MM-DD-YYYY HH:mm'))
```

## License

[MIT](../../LICENSE)
