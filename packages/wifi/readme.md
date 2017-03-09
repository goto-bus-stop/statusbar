# @statusbar/wifi

A WiFi status block for [Statusbar](https://github.com/goto-bus-stop/statusbar).

## Usage

```js
const wifi = require('@statusbar/wifi')

bar.use(wifi())
// Or with options:
bar.use(wifi({
  // wlan0 is default.
  device: 'wlan1'
}))
```

## License

[MIT](../../LICENSE)
