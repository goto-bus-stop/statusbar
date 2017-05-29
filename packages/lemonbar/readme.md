# @statusbar/lemonbar

lemonbar output for [Statusbar](https://github.com/goto-bus-stop/statusbar).

## Usage

```js
const lemonbar = require('@statusbar/lemonbar')

bar.use(lemonbar())
```

Then pipe statusbar and lemonbar together, perhaps using [dupsh](https://github.com/substack/dupsh):

```bash
dupsh 'statusbar ./config.js' 'lemonbar'
```

## License

[MIT](../../LICENSE)
