const json = require('JSONStream')

const defaultOptions = {
  input: process.stdin,
  output: process.stdout
}

module.exports = (options = {}) => (bar) => {
  options = Object.assign({}, defaultOptions, options)

  // Write the i3bar protocol header.
  options.output.write(JSON.stringify({
    version: 1,
    click_events: true
  }) + '\n')

  // Statusbar uses the i3bar protocol internally, so we can just pass inputs
  // and outputs through.

  bar.output
    .pipe(json.stringify())
    .pipe(options.output)

  options.input
    .pipe(json.parse())
    .pipe(bar.input)
}
