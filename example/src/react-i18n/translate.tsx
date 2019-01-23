// import React from 'react'
import { TranslationSet, TranslationOptions } from './types'

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

export const normalizeMessage = (message: string, options?: TranslationOptions) => {
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

export const replaceString = (
  text: string,
  count: number | null,
  data?: object | null
) => {
  const obj = Object.assign({ n: count, ...data })
  Object.keys(obj).map(key => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), obj[key])
  })
  return text
}

export const replaceJsx = (
  text: string,
  count: number | null,
  data?: object | null
) => {
  // tslint:disable:no-console
  const pieces: Array<any> = []

  let giveup = 30

  const reg = new RegExp(/!\[(.*?)\]\((.*?)\)/, 'sm')

  while (true) {
    const match = text.match(reg)
    if (!match) {
      pieces.push(text)
      return pieces
    }

    const startMatch = match.index!
    const endMatch = startMatch + match[0].length
    const textPiece = match[1]
    const componentPiece = match[2]

    const firstPiece = text.slice(0, startMatch)
    if (firstPiece) {
      pieces.push(firstPiece)
    }

    text = text.slice(endMatch)

    const cb = data && data[componentPiece]
    if (cb) {
      pieces.push(cb(textPiece))
    } else {
      pieces.push(textPiece)
    }

    giveup -= 1
    if (giveup <= 0) {
      return pieces
    }
  }

  const obj = Object.assign({ n: count, ...data })
  const keys = Object.keys(obj).join('}|{')
  const entries = text.split(new RegExp(`({${keys}})`, 'g')).map(entry => {
    // Check if the first character is a bracket. It's a little faster than looking up in a map.
    if (entry[0] !== '{') {
      return entry
    }
    // Cut off the `{` and `}`
    const key = entry.substring(1, entry.length - 1)
    const match = obj[key]
    if (!match) {
      return entry
    }
    return match
  })

  return entries
}
