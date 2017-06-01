# @statusbar/mpd

An [mpd](https://musicpd.org) "Now Playing" block for statusbar.

## Usage

```js
const mpd = require('@statusbar/mpd')

bar.use(nowplaying({
  format: '{artist} - {title}',

  // connection defaults:
  port: 6600,
  host: 'localhost',
  // but you can also use a domain socket:
  path: '/var/run/mpd.sock'
}))
```

## Format

The `format` option takes a simple formatting string.
Supported tags:

 - `{artist}` - The artist name. (the `Artist` meta field)
 - `{album}` - The album that this song is on.
 - `{title}` - The song title.
 - `{track}` - Track number of this song in the album.
 - `{albumartist}` - The Album Artist meta field.

## License

[MIT](../../LICENSE)
