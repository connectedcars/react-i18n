#!/usr/bin/env node
const { GettextExtractor, JsExtractors, HtmlExtractors } = require('gettext-extractor')

let extractor = new GettextExtractor()

extractor.callExpression = null

extractor
  .createJsParser([
    JsExtractors.callExpression(['t', '[this].context.t'], {
      arguments: {
        text: 0,
        // data
        context: 2
      }
    }),

    JsExtractors.callExpression(['tn', '[this].context.tn'], {
      arguments: {
        // count
        text: 1,
        textPlural: 2,
        // data
        context: 4
      }
    })
  ])
  .parseFilesGlob('./src/**/*.@(ts|js|tsx|jsx)')

extractor.savePotFile('./locales/template.pot')

extractor.printStats()
