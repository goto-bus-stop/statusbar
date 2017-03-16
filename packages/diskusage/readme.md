# @statusbar/diskusage

A Disk usage block for [Statusbar](https://github.com/goto-bus-stop/statusbar).

## Usage

```js
const diskusage = require('@statusbar/diskusage')

// Devices are labelled by their mount point by default.
bar.use(diskusage('/dev/sda1'))
// But you can add a custom label, too!
bar.use(diskusage({ fs: '/dev/sda2', label: '📂' }))
```

## License

[MIT](../../LICENSE)
