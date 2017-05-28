const bar = require('../packages/statusbar')()
const dzen = require('../packages/dzen')
const date = require('../packages/date')
const brightness = require('../packages/brightness')
const battery = require('../packages/battery')
const diskusage = require('../packages/diskusage')
const volume = require('../packages/volume')
const whoami = require('../packages/whoami')
const text = require('../packages/text')
const wifi = require('../packages/wifi')

bar.use(text({
  background: 'white',
  color: 'red',
  text: 'Quit',
  onclick: () => bar.dispose()
}))

bar.use(wifi())
bar.use(brightness())
bar.use(battery())
bar.use(diskusage('/dev/sda2'))
bar.use(diskusage('/dev/sdb2'))
bar.use(date())
bar.use(volume())
bar.use(text('hello'))
bar.use(whoami({
  background: 'rebeccapurple',
  color: 'white'
}))

bar.use(dzen())
