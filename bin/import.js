#!/usr/bin/env node
const fs = require('fs')
const glob = require('glob')
const po2json = require('@connectedcars/po2json')

const localesPath = 'locales/*.po'
const outputFile = 'src/translations.json'
const prettyPrint = true

let translations = {}

const args = process.argv.slice(2)

const stripCountry = args.includes('--stripCountry')

const languageHeaderIndex = args.findIndex((v) => v === '--languageHeader')
let languageHeader = 'Language'
if (languageHeaderIndex !== -1) {
  languageHeader = args[languageHeaderIndex + 1]
}

glob(localesPath, (err, files) => {
  if (err) {
    throw err
  }

  files.forEach((file) => {
    const pocontent = po2json.parseFileSync(file)
    const header = pocontent['']
    if (!header) {
      throw new Error('import: missing header')
    }

    const langHeader = header[languageHeader]
    const lang = stripCountry ? langHeader.slice(0, 2) : langHeader
    if (!lang) {
      throw new Error('import: language missing from header')
    }
    const pluralForms = header['Plural-Forms']
    if (!pluralForms) {
      throw new Error('import: Plural-Forms missing from header')
    }

    translations[lang] = pocontent
  })

  const stream = fs.createWriteStream(outputFile)
  stream.write(JSON.stringify(translations, null, prettyPrint ? 2 : 0))
  stream.close()
})
