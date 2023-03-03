#!/usr/bin/env node
const glob = require('glob')
const po2json = require('@connectedcars/po2json')

const defaultLocalesPath = 'locales/*.po'
const defaultTemplatePath = 'locales/template.pot'
const LOCALES_PATH = process.argv[2] || defaultLocalesPath
const TEMPLATE_PATH = process.argv[3] || defaultTemplatePath


const templateContent = po2json.parseFileSync(TEMPLATE_PATH)
// Subtract header
const totalStrings = Object.keys(templateContent).length - 1

glob(LOCALES_PATH, (err, files) => {
  if (err) {
    throw err
  }

  const translationStatus = files.map(file => {
    const pocontent = po2json.parseFileSync(file)

    const header = pocontent['']
    const language = header['Language-Team']
    const languageCode = header['Language']
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
      missingStrings: totalStrings - translatedStrings
    }
  })

  console.log(JSON.stringify(translationStatus, null, 2))
})
