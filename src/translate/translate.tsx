import { TranslationSet, TranslationOptions } from '../types'
import { normalizeContent } from './normalize-content'

const CONTEXT_GLUE = '\u0004'

export const getTranslation = (
  translationSet: TranslationSet | undefined,
  n: number | null,
  singular: string,
  plural?: string | null,
  context?: string | null,
  options?: TranslationOptions
): string => {
  // Clean our translation.
  singular = normalizeContent(singular, options.content)

  const defaultValue = plural ? (n !== 1 ? plural : singular) : singular

  if (!translationSet) {
    return defaultValue
  }

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

const getPluralFunc = (pluralForms: string) => {
  const code = [
    'var plural;',
    'var nplurals;',
    pluralForms,
    'return (plural === true ? 1 : plural ? plural : 0);',
  ]
  return Function('n', code.join('\n'))
}
