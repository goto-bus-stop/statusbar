#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const config = process.argv[2]

if (!config) {
  console.log('Usage: statusbar <config-file>')
  process.exit(1)
}

require(path.resolve(process.cwd(), config))
