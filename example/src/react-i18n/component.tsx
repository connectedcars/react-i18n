import React, { createContext, PureComponent } from 'react'
import {
  Translations,
  TranslateFunc,
  TranslateJsxFunc,
  TranslatePluralFunc,
  TranslatePluralJsxFunc,
} from './types'
import { getTranslation, replaceString, replaceJsx } from './translate'

interface Context {
  t: TranslateFunc
  tx: TranslateJsxFunc
  tn: TranslatePluralFunc
  tnx: TranslatePluralJsxFunc
  locale: string
  setLocale: (lang: string) => void
  translations: Translations
  setTranslations: (translations: Translations) => void
}

const noop = (...args: any[]): any => {} // tslint:disable-line:no-empty

export const Context = createContext<Context>({
  t: noop,
  tx: noop,
  tn: noop,
  tnx: noop,
  locale: '',
  setLocale: noop,
  translations: {},
  setTranslations: noop,
})

interface ProviderProps {
  locale: string
  translations: Translations
  options?: {
    trimWhiteSpace?: boolean
    preserveIndentation?: boolean
    replaceNewLines?: false | string
  }
}

interface ProviderState {
  locale: string
  translations: Translations
}

export class Provider extends PureComponent<ProviderProps> {
  state: ProviderState = {
    locale: this.props.locale,
    translations: this.props.translations,
  }

  getTranslations = () => {
    const { translations, locale } = this.state
    return translations[locale]
  }

  setTranslations = (translations: Translations) => {
    this.setState({ translations })
  }

  setLocale = (lang: string) => {
    this.setState({ lang })
  }

  normalizeMessage = (message: string) => {
    const {
      trimWhiteSpace = true,
      preserveIndentation = false,
      replaceNewLines = false,
    } = this.props.options || {}

    if (trimWhiteSpace) {
      message = message.replace(/^\n+|\s+$/g, '')
    }
    if (!preserveIndentation) {
      message = message.replace(/^[ \t]+/gm, '')
    }
    if (typeof replaceNewLines === 'string') {
      message = message.replace(/\n/g, replaceNewLines)
    }

    return message
  }

  t: TranslateFunc = (message, data, context) => {
    // tslint:disable:no-console
    console.log(this.getTranslations(), { [this.normalizeMessage(message)]: true })
    console.log(
      this.getTranslations().hasOwnProperty(this.normalizeMessage(message))
    )
    const msg = getTranslation(
      this.getTranslations(),
      null,
      this.normalizeMessage(message),
      null,
      context
    )

    return replaceString(msg, null, data)
  }

  tx: TranslateJsxFunc = (message, data, context) => {
    const msg = getTranslation(
      this.getTranslations(),
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
      this.getTranslations(),
      count,
      singular,
      plural,
      context
    )

    return replaceString(message, count, data)
  }

  tnx: TranslatePluralJsxFunc = (count, singular, plural, data, context) => {
    const message = getTranslation(
      this.getTranslations(),
      count,
      singular,
      plural,
      context
    )

    return replaceJsx(message, null, data).map((el, idx) => (
      <React.Fragment key={idx} children={el} />
    ))
  }

  render() {
    const value = {
      t: this.t,
      tx: this.tx,
      tn: this.tn,
      tnx: this.tnx,
      locale: this.state.locale,
      setLocale: this.setLocale,
      translations: this.state.translations,
      setTranslations: this.setTranslations,
    }

    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    )
  }
}
