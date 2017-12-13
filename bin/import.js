#!/usr/bin/env node
const fs = require('fs')
const glob = require('glob')
const po2json = require('po2json')

const localesPath = 'locales/*.po'
const outputFile = 'src/translations.json'

let translations = {}

glob(localesPath, (err, files) => {
  if (err) {
    throw err
  }

  files.map(file => {
    const pocontent = po2json.parseFileSync(file)
    const header = pocontent['']
    if (!header) {
      throw new Error('import: missing header')
    }
    const lang = header['language']
    if (!lang) {
      throw new Error('import: language missing from header')
    }
    const pluralForms = header['plural-forms']
    if (!pluralForms) {
      throw new Error('import: plural-forms missing from header')
    }

    translations[lang] = pocontent
  })

  const stream = fs.createWriteStream(outputFile)
  stream.write(JSON.stringify(translations))
  stream.close()
})
