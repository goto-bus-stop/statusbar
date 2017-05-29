# @statusbar/battery

A battery status block for [Statusbar](https://github.com/goto-bus-stop/statusbar).

## Usage

```js
const battery = require('@statusbar/battery')

bar.use(battery())
```

## Dependencies

This block uses [upower](https://upower.freedesktop.org) to retrieve battery information.
It probably came preinstalled with your OS, and if not it should be available in the relevant repositories:

```bash
apt-get install upower
# or
pacman -S upower
# etc
```

## License

[MIT](../../LICENSE)
