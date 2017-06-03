#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const xdg = require('xdg-basedir')

const config = process.argv[2] || path.join(xdg.config, 'statusbar')

if (!config) {
  console.log('Usage: statusbar <config-file>')
  process.exit(1)
}

const configPath = path.resolve(process.cwd(), config)
let configModule
try {
  configModule = require.resolve(configPath)
} catch (err) {
  console.error(`Could not find config file "${config}"`)
  process.exit(1)
}

global.bar = require('.')()

require(configModule)
