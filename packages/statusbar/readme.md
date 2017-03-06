# statusbar

Small status bar for Dzen, i3, etc in Node.js.

## Usage

```js
// Create statusbar
const bar = require('statusbar')()

// Add blocks
const date = require('@statusbar/date')
bar.use(date())
```

## License

[MIT](../../LICENSE)
