import { TranslationOptions, Translations } from '../types'
import { isSameLocale, parseLocale } from './helpers'
import { normalizeContent } from './normalize-content'

const CONTEXT_GLUE = '\u0004'

interface GetTranslationOptions {
  translations: Translations
  locale: string
  defaultLocale: string
  n: number | null
  singular: string
  plural?: string | null
  context?: string | null
  options?: TranslationOptions
}

export const getTranslation = ({
  translations,
  locale,
  defaultLocale,
  n,
  singular,
  plural,
  context,
  options = {},
}: GetTranslationOptions): string => {
  // Clean our translation.
  singular = normalizeContent(singular, options.content)

  const defaultValue = plural ? (n !== 1 ? plural : singular) : singular

  // Generate our message id. If we have a context, join them.
  const msgid = context != null ? context + CONTEXT_GLUE + singular : singular

  // Find a translation set with a matching msgid gracefully.
  const translationSet = getTranslationSetGracefully(
    translations,
    locale,
    defaultLocale,
    msgid
  )
  const msgstr = (translationSet?.[msgid] || []).slice()
  if (msgstr.length === 0) {
    if (options.verbose) {
      console.warn(
        `translation not found for: msg='${singular}', msg_plural='${plural}'`
      )
    }
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
    if (options.verbose) {
      console.warn(
        `translations for plural does not match '${plural}' != '${msgstrPlural}'`
      )
    }
    return defaultValue
  }

  // Get plural-forms from the header.
  const pluralForms = translationSet[''] && translationSet['']['Plural-Forms']
  if (!pluralForms) {
    if (options.verbose) {
      console.warn('translations are missing Plural-Forms setting')
    }
    return defaultValue
  }

  const msgstrIndex = getPluralFunc(pluralForms as string)(n)
  const result = msgstr[msgstrIndex]
  // Reason for checking if it's an Array: https://github.com/connectedcars/po2json/blob/master/lib/parse.js#L88-L89
  // We could probably just check if pluralForms = nplurals=1; plural=0;
  // However, this seems more robust.
  return Array.isArray(result) ? result[0] : result || defaultValue
}

const getPluralFunc = (pluralForms: string) => {
  const code = [
    'var plural;',
    'var nplurals;',
    pluralForms,
    'return (plural === true ? 1 : plural ? plural : 0);',
  ]
  return Function('n', code.join('\n'))
}

const getTranslationSetGracefully = (
  translations: Translations,
  locale: string,
  defaultLocale: string,
  msgid: string
) => {
  const supportedLanguages = [defaultLocale]
    .concat(Object.keys(translations))
    .filter((l) => {
      const userLocale = parseLocale(locale)
      const supportedLocale = parseLocale(l)
      return (
        userLocale.languageCode.toLowerCase() ===
        supportedLocale.languageCode.toLowerCase()
      )
    })

  const exists = (locale: string, msgid: string) => {
    return Array.isArray(translations?.[locale]?.[msgid])
  }

  // Find translation set gracefully
  // - If we have supported languages: `es_ES, es_XX, es` and the language is set to `es_YY` then fall back on `es` (strip the `_xx` suffix).
  // - If we have supported languages: `es_ES, es_XX` but not `es` and the language is `es_YY` we should just take the first available `es*` in the list.
  // - If we have `es_YY` but no `es*` supported, fallback to whatever the `defaultLocale` is.

  const directMatch = supportedLanguages.find((v) => isSameLocale(locale, v))
  if (exists(directMatch, msgid)) {
    return translations[directMatch]
  }
  if (directMatch === defaultLocale) {
    return null
  }

  const sansLocale = parseLocale(locale).languageCode
  if (exists(sansLocale, msgid)) {
    return translations[sansLocale]
  }

  const firstMatchWithCountryCode = supportedLanguages.find((v) => {
    const supportedLocale = parseLocale(v)
    if (!supportedLocale.countryCode) {
      return false
    }
    return !isSameLocale(locale, v)
  })

  if (exists(firstMatchWithCountryCode, msgid)) {
    return translations[firstMatchWithCountryCode]
  }

  return null
}
