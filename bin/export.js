#!/usr/bin/env node
const { GettextExtractor, JsExtractors } = require('gettext-extractor')

let extractor = new GettextExtractor()

const content = {
  trimWhiteSpace: true,
  preserveIndentation: false,
}

extractor
  .createJsParser([
    JsExtractors.callExpression(['t', '[this].props.t', '[this].context.t'], {
      arguments: {
        text: 0,
        // data
        context: 2,
      },
      content,
    }),

    JsExtractors.callExpression(
      ['tn', '[this].props.tn', '[this].context.tn'],
      {
        arguments: {
          // count
          text: 1,
          textPlural: 2,
          // data
          context: 4,
        },
        content,
      }
    ),

    JsExtractors.callExpression(
      ['tx', '[this].props.tx', '[this].context.tx'],
      {
        arguments: {
          text: 0,
          // data
          context: 2,
        },
        content,
      }
    ),

    JsExtractors.callExpression(
      ['tnx', '[this].props.tnx', '[this].context.tnx'],
      {
        arguments: {
          // count
          text: 1,
          textPlural: 2,
          // data
          context: 4,
        },
        content,
      }
    ),
  ])
  .parseFilesGlob('./src/**/*.@(ts|js|tsx|jsx)')

extractor.savePotFile('./locales/template.pot')

extractor.printStats()
