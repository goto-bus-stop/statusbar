# @statusbar/dzen

dzen integration for [Statusbar](https://github.com/goto-bus-stop/statusbar).

## Usage

```js
const dzen = require('@statusbar/dzen')

bar.use(dzen())
```

## Options

See the [dzen2](https://github.com/goto-bus-stop/dzen2#stream--dzenoptions) options.

This module supports one additional option:

 - `spawn` - Whether the module should start dzen.
   Defaults to `true`.
   When `false`, dzen-formatted output will be written to stdout instead.
   You can then run statusbar by piping its stdout and stdin to dzen's using something like [dupsh](https://github.com/substack/dupsh):

   ```bash
   npm install --global dupsh
   dupsh 'statusbar' 'dzen2 -dock'
   ```

## License

[MIT](../../LICENSE)
