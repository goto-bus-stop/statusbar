const split = require('split')

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
  }) + '\n[\n')

  // Statusbar uses the i3bar protocol internally, so we can just pass inputs
  // and outputs through.

  function oninput (chunk) {
    bar.input.write(JSON.parse(chunk))
  }

  function onoutput (chunk, encoding) {
    options.output.write(JSON.stringify(chunk) + ',\n')
  }

  bar.output.on('data', onoutput)
  options.input.pipe(split()).on('data', oninput)
}
