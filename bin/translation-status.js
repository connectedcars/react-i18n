#!/usr/bin/env node
const glob = require('glob')
const po2json = require('po2json')

const defaultLocalesPath = 'locales/*.po'
const LOCALES_PATH = process.argv[2] || defaultLocalesPath

glob(LOCALES_PATH, (err, files) => {
  if (err) {
    throw err
  }

  const translationStatus = files.map(file => {
    const pocontent = po2json.parseFileSync(file)

    const header = pocontent['']
    const language = header['language-team']
    const languageCode = header['language']
    // Subtract header
    const totalStrings = Object.keys(pocontent).length-1
    let translatedStrings = 0
    for (const key in pocontent) {
      if (pocontent[key][1]) {
        translatedStrings += 1
      }
    }
    return {
      language,
      languageCode,
      totalStrings,
      translatedStrings,
      missingStrings: totalStrings-translatedStrings
    }
  })

  console.log(JSON.stringify(translationStatus))
})
