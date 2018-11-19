import React, {
  createContext,
  PureComponent,
  ReactChild,
  ReactNode,
} from 'react'
import ReactDOM from 'react-dom'
// import App from './App'
import './index.css'

const translations = require('./translations.json')

interface PoConfig {
  '': Record<string, string>
}

interface PoTranslation {
  [key: string]: Record<string, string[]>
}

type PoFile = PoConfig | PoTranslation

interface Translations {
  [lang: string]: PoFile
}

type TranslateFunc = (
  message: string,
  data?: Record<string, any>,
  context?: string
) => string

type TranslateJsxFunc = (
  message: string,
  data?: Record<string, ReactChild>,
  context?: string
) => ReactNode

type TranslatePluralFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: Record<string, any>,
  context?: string
) => string

type TranslatePluralJsxFunc = (
  n: number,
  singular: string,
  plural: string,
  data?: Record<string, any>,
  context?: string
) => ReactNode

interface Context {
  // translations: Record<string, Record<string, string | string[]>>
  lang: string
  setLanguage: (lang: string) => void
  t: TranslateFunc
  tx: TranslateJsxFunc
  tn: TranslatePluralFunc
  tnx: TranslatePluralJsxFunc
}

const noop = () => {} // tslint:disable-line:no-empty

const Context = createContext<Context>({
  lang: '',
  setLanguage: noop,
  t: noop as any,
  tx: noop as any,
  tn: noop as any,
  tnx: noop as any,
})

const DEFAULT_LANG = 'en'
const CONTEXT_GLUE = '\u0004'
// const DEFAULT_PLURAL = 'nplurals=2; plural=(n != 1);'
const getTranslation = (
  translations: Translations,
  lang: string,
  n: number | null,
  singular: string,
  plural?: string | null,
  context?: string | null
): string => {
  lang = lang || DEFAULT_LANG

  const defaultValue = plural ? (n !== 1 ? plural : singular) : singular

  if (lang === DEFAULT_LANG) {
    return defaultValue
  }

  // Make sure the language exists in our translation set.
  if (translations.hasOwnProperty(lang) === false) {
    console.warn(`translations does not contain language: '${lang}'`)
    return defaultValue
  }

  // Get our language set.
  const translationSet = translations[lang]

  // Generate our message id. If we have a context, join them.
  const msgid = context != null ? context + CONTEXT_GLUE + singular : singular

  // Get the translation values.
  // First entry is our `textPlural` and the following are translations.
  const msgstr = (translationSet[msgid] || []).slice()
  if (msgstr.length === 0) {
    console.warn(
      `translation not found for: text='${singular}', text_plural='${plural}'`
    )
    return defaultValue
  }

  // Shift off the first entry, it's our original translation plural.
  const msgstrPlural = msgstr.shift()

  // Deal with plurals.
  if (plural) {
    if (plural !== msgstrPlural) {
      console.warn(
        `translations for textPlural does not match '${plural}' != '${msgstrPlural}'`
      )
      return defaultValue
    }

    // Get plural-forms from the header.
    let pluralForms = translationSet[''] && translationSet['']['plural-forms']

    if (!pluralForms) {
      console.warn(
        `translations does not have a plural-forms setting for language: '${lang}'`
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

class Provider extends PureComponent<{
  translations: Translations
  defaultLang: string
}> {
  state = {
    lang: this.props.defaultLang,
  }

  t: TranslateFunc = (message, data, context) => {
    const msg = getTranslation(
      translations,
      this.state.lang,
      null,
      message,
      null,
      context
    )
    return replaceString(msg, null, data)
  }

  tx: TranslateJsxFunc = (message, data, context) => {
    const msg = getTranslation(
      translations,
      this.state.lang,
      null,
      message,
      null,
      context
    )
    return replaceJsx(msg, null, data).map((el, idx) => (
      <React.Fragment key={idx} children={el} />
    ))
  }

  tn: TranslatePluralFunc = (count, singular, plural, data, context) => {
    const message = getTranslation(
      translations,
      this.state.lang,
      count,
      singular,
      plural,
      context
    )
    return replaceString(message, count, data)
  }

  tnx: TranslatePluralJsxFunc = (count, singular, plural, data, context) => {
    const message = getTranslation(
      translations,
      this.state.lang,
      count,
      singular,
      plural,
      context
    )
    return replaceJsx(message, null, data).map((el, idx) => (
      <React.Fragment key={idx} children={el} />
    ))
  }

  setLanguage = (lang: string) => {
    this.setState({ lang })
  }

  render() {
    const value = {
      lang: this.state.lang,
      t: this.t,
      tx: this.tx,
      tn: this.tn,
      tnx: this.tnx,
      setLanguage: this.setLanguage,
    }
    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    )
  }
}

const replaceString = (text: string, count: number | null, data?: object) => {
  let ourData: any = data || {}
  ourData.n = ourData.n || count
  Object.keys(ourData).map(key => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), ourData[key])
  })
  return text
}

const replaceJsx = (text: string, count: number | null, data?: object) => {
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

ReactDOM.render(
  <Provider translations={translations} defaultLang="da">
    <>
      <Context.Consumer>
        {props => {
          return (
            <React.Fragment>
              <div>{props.t('Hello {name}', { name: 'world!' })}</div>

              <div>
                {props.tx('Hello {name}', { name: <strong>world!</strong> })}
              </div>

              <div>{props.tn(1, '{n} day ago', '{n} days ago')}</div>
              <div>{props.tn(2, '{n} day ago', '{n} days ago')}</div>

              <div>
                {props.tnx(1, '{n} day ago', '{n} days ago', {
                  n: <strong>1</strong>,
                })}
              </div>
              <div>
                {props.tnx(2, '{n} day ago', '{n} days ago', {
                  n: <strong>2</strong>,
                })}
              </div>
            </React.Fragment>
          )
        }}
      </Context.Consumer>
      {/* <App /> */}
    </>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
