const DEFAULT_LANG = 'en'
const DEFAULT_PLURAL = 'nplurals=2; plural=(n != 1);'
const CONTEXT_GLUE = '\u0004'

export type TranslationBlock = string | null

export interface TranslationSet {
  [msgid: string]: TranslationBlock[]
}

export interface Translations {
  [lang: string]: TranslationSet
}

export const getTranslation = (translations: Translations, lang: string) => (
  n: number,
  text: string,
  textPlural?: string | null,
  context?: string | null
): string => {
  lang = lang || DEFAULT_LANG

  const fallback = getFallbackTranslation(n, text, textPlural)

  if (lang === DEFAULT_LANG) {
    return fallback
  }

  // Make sure the language exists in our translation set.
  if (translations.hasOwnProperty(lang) === false) {
    console.warn(`translations does not contain language: '${lang}'`)
    return fallback
  }

  // Get our language set.
  const translationSet = translations[lang]

  // Generate our message id. If we have a context, join them.
  const msgid = context != null
    ? context + CONTEXT_GLUE + text
    : text

  // Get the translation values.
  // First entry is our `textPlural` and the following are translations.
  const msgstr = (translationSet[msgid] || []).slice()
  if (msgstr.length === 0) {
    console.warn(`translation not found for: text='${text}', text_plural='${textPlural}'`)
    return fallback
  }

  // Shift off the first entry, it's our original translation plural.
  const msgstrPlural = msgstr.shift()

  // Deal with plurals.
  if (textPlural) {
    if (textPlural !== msgstrPlural) {
      console.warn(`translations for textPlural does not match '${textPlural}' != '${msgstrPlural}'`)
      return fallback
    }

    // Get plural-forms from the header.
    let pluralForms = translationSet[''] && translationSet['']['plural-forms']

    if (!pluralForms) {
      console.warn(
        `translations does not have a plural-forms setting on language: '${lang}', default to: '${DEFAULT_PLURAL}'`
      )
      pluralForms = DEFAULT_PLURAL
    }

    const msgstrIndex = pluralFunc(pluralForms)(n)
    return msgstr[msgstrIndex] || fallback
  }

  // Deal with singulars.
  return msgstr[0] || fallback
}

const getFallbackTranslation = (n: number, text: string, textPlural?: string | null) => {
  if (textPlural != null) {
    return [text, textPlural][pluralFunc(DEFAULT_PLURAL)(n)]
  }
  return text
}

export const pluralFunc = (pluralForms: string) => {
  const code = [
    'var plural;',
    'var nplurals;',
    pluralForms,
    'return (plural === true ? 1 : plural ? plural : 0);'
  ]
  return Function('n', code.join('\n'))
}

export const replace = (text: string, count: number, data?: Object) => {
  let ourData: any = data || {}
  if (ourData.hasOwnProperty('n')) {
    console.warn('translations data keyword `n` is reserved')
  }
  ourData.n = count
  Object.keys(ourData).map(key => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), ourData[key])
  })
  return text
}
