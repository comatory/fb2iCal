#!/usr/bin/env node

const parseUsingLDJSONData = require('./services/ldjson-parser')
const parseUsingDOM = require('./services/dom-parser')
const { createParserError, createAppLogger } = require('./utils')

const parseHTMLString = (html, { verbose }) => {
  const logger = verbose ?
    createAppLogger({ dev: true }) :
    null

  try {
    const LDJSONEventData = parseUsingLDJSONData(html, { logger })
    // TODO: adding empty string for URL argument since we don't know original
    //       URL of document
    const eventData = LDJSONEventData || parseUsingDOM(html, '', { logger })

    if (!eventData) {
      throw createParserError()
      return
    }

    process.stdout.write(JSON.stringify(eventData))
  } catch (err) {
    console.error(err)
    process.stderr.write(err.toString())
    process.exit(1)
  }
}

const argv = require('yargs')
  .command('$0 <html> [options]', 'Parse Facebook event HTML page into JSON data.', (yargs) => {
    yargs.positional('html', {
      describe: 'valid HTML string',
      type: 'string',
    })
  }, (argv) => {
    const { html, verbose } = argv
    parseHTMLString(html, { verbose })
  })
  .option('verbose', {
    alias: 'v',
    description: 'Add logging to output.',
    type: 'boolean',
  })
  .alias('h', 'help')
  .help('h')
  .argv

