import { Translations } from './types';

const DEFAULT_LOCALE = 'en'
const CONTEXT_GLUE = '\u0004'
// const DEFAULT_PLURAL = 'nplurals=2; plural=(n != 1);'

export const getTranslation = (
  translations: Translations,
  locale: string,
  n: number | null,
  singular: string,
  plural?: string | null,
  context?: string | null
): string => {
  locale = locale || DEFAULT_LOCALE

  const defaultValue = plural ? (n !== 1 ? plural : singular) : singular

  if (locale === DEFAULT_LOCALE) {
    return defaultValue
  }

  // Make sure the locale exists in our translation set.
  if (translations.hasOwnProperty(locale) === false) {
    console.warn(`translations does not contain locale: '${locale}'`)
    return defaultValue
  }

  // Get our locale set.
  const translationSet = translations[locale]

  // Generate our message id. If we have a context, join them.
  const msgid = context != null ? context + CONTEXT_GLUE + singular : singular

  // Get the translation values.
  // First entry is our `plural` and the following are translations.
  const msgstr = (translationSet[msgid] || []).slice()
  if (msgstr.length === 0) {
    console.warn(
      `translation not found for: msg='${singular}', msg_plural='${plural}'`
    )
    return defaultValue
  }

  // Shift off the first entry, it's our original translation plural.
  const msgstrPlural = msgstr.shift()

  // Deal with plurals.
  if (plural) {
    if (plural !== msgstrPlural) {
      console.warn(
        `translations for plural does not match '${plural}' != '${msgstrPlural}'`
      )
      return defaultValue
    }

    // Get plural-forms from the header.
    let pluralForms = translationSet[''] && translationSet['']['plural-forms']

    if (!pluralForms) {
      console.warn(
        `translations does not have a plural-forms setting for locale: '${locale}'`
      )
      // pluralForms = DEFAULT_PLURAL
      return defaultValue
    }

    const msgstrIndex = getPluralFunc(pluralForms as string)(n)
    return msgstr[msgstrIndex] || defaultValue
  }

  // Deal with singulars.
  return msgstr[0] || defaultValue
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

export const replaceString = (text: string, count: number | null, data?: object) => {
  let ourData: any = data || {}
  ourData.n = ourData.n || count
  Object.keys(ourData).map(key => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), ourData[key])
  })
  return text
}

export const replaceJsx = (text: string, count: number | null, data?: object) => {
  const ourData: any = data || {}
  const keys = Object.keys(ourData).join('|')
  const entries = text.split(new RegExp(`({${keys}})`, 'g')).map(entry => {
    // Check if the first character is a bracket. It's a little faster than looking up in a map.
    if (entry[0] !== '{') {
      return entry
    }
    // Cut off the `{` and `}`
    const key = entry.substring(1, entry.length - 1)
    const match = ourData[key]
    if (!match) {
      return entry
    }
    return match
  })

  return entries
}
