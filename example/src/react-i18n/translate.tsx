import React from 'react'
import { TranslateData, TranslationOptions, TranslationSet } from './types'
import { parse, DocNode, TextNode, ElementNode, voidElements } from './parser'

const CONTEXT_GLUE = '\u0004'

export const getTranslation = (
  translationSet: TranslationSet,
  n: number | null,
  singular: string,
  plural?: string | null,
  context?: string | null,
  options?: TranslationOptions
): string => {
  // Clean our translation.
  singular = normalizeMessage(singular, options)

  const defaultValue = plural ? (n !== 1 ? plural : singular) : singular

  // Generate our message id. If we have a context, join them.
  const msgid = context != null ? context + CONTEXT_GLUE + singular : singular

  // Get the translation values.
  // First entry is our `plural` and the following strings are translations.
  const msgstr = (translationSet[msgid] || []).slice()
  if (msgstr.length === 0) {
    console.warn(
      `translation not found for: msg='${singular}', msg_plural='${plural}'`
    )
    return defaultValue
  }

  // Shift off the first entry, it's our original translation plural.
  const msgstrPlural = msgstr.shift()

  // Deal with singulars.
  if (!plural) {
    return msgstr[0] || defaultValue
  }

  // Deal with plurals.
  if (plural !== msgstrPlural) {
    console.warn(
      `translations for plural does not match '${plural}' != '${msgstrPlural}'`
    )
    return defaultValue
  }

  // Get plural-forms from the header.
  let pluralForms = translationSet[''] && translationSet['']['plural-forms']

  if (!pluralForms) {
    console.warn(`translations are missing plural-forms setting`)
    return defaultValue
  }

  const msgstrIndex = getPluralFunc(pluralForms as string)(n)

  return msgstr[msgstrIndex] || defaultValue
}

export const normalizeMessage = (
  message: string,
  options?: TranslationOptions
) => {
  const {
    trimWhiteSpace = true,
    preserveIndentation = false,
    replaceNewLines = false,
  } = options || {}

  if (trimWhiteSpace) {
    message = message.replace(/^\n+|\s+$/g, '')
  }
  if (!preserveIndentation) {
    message = message.replace(/^[ \t]+/gm, '')
  }
  message = message.replace(/\r\n/g, '\n')
  if (typeof replaceNewLines === 'string') {
    message = message.replace(/^\n+|\s+$/g, replaceNewLines)
  }

  return message
}

export const getPluralFunc = (pluralForms: string) => {
  const code = [
    'var plural;',
    'var nplurals;',
    pluralForms,
    'return (plural === true ? 1 : plural ? plural : 0);',
  ]
  return Function('n', code.join('\n'))
}

export const replaceString = (text: string, data?: TranslateData | null) => {
  if (!data) {
    return text
  }

  Object.keys(data).forEach(key => {
    let v = data[key]
    if (typeof v === 'function') {
      return
    }
    text = text.replace(new RegExp(`{${key}}`, 'g'), String(v))
  })
  return text
}

export const replaceJsx = (
  str: string,
  data?: TranslateData | null
): React.ReactNode[] => {
  return parse(replaceString(str, data)).map(node => renderNode(node, data))
}

const renderNode = (
  node: DocNode,
  data?: TranslateData | null
): React.ReactNode => {
  if (node instanceof TextNode) {
    return node.text
  }

  if (node instanceof ElementNode) {
    if (data) {
      const dataValue = data[node.tagName]
      if (dataValue != null) {
        if (typeof dataValue === 'function') {
          return dataValue(
            node.children.map(node => renderNode(node, data)),
            node.attributes
          )
        }

        return dataValue
      }
    }

    // Maybe do a `strict` mode or a whitelist for tags and otherwise throw an error:
    // throw new Error(`data not found for tag ${node.tagName}`)

    if (voidElements[node.tagName]) {
      return React.createElement(node.tagName, {
        key: node.text,
      })
    }

    return React.createElement(node.tagName, {
      key: node.text,
      children: node.children.map(node => renderNode(node, data)),
    })
  }

  throw new Error('unsupported node type')
}
