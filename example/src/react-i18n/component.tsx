import React, { createContext, PureComponent } from 'react'
import {
  Translations,
  TranslateFunc,
  TranslateJsxFunc,
  TranslatePluralFunc,
  TranslatePluralJsxFunc,
} from './types'
import {
  getTranslation,
  replaceString,
  replaceJsx,
} from './translate'

interface Context {
  t: TranslateFunc
  tx: TranslateJsxFunc
  tn: TranslatePluralFunc
  tnx: TranslatePluralJsxFunc
  locale: string
  setLocale: (lang: string) => void
}

const noop = () => {} // tslint:disable-line:no-empty

export const Context = createContext<Context>({
  locale: '',
  setLocale: noop,
  t: noop as any,
  tx: noop as any,
  tn: noop as any,
  tnx: noop as any,
})

export class Provider extends PureComponent<{
  translations: Translations
  defaultLocale: string
}> {
  state = {
    locale: this.props.defaultLocale,
  }

  t: TranslateFunc = (message, data, context) => {
    const msg = getTranslation(
      this.props.translations,
      this.state.locale,
      null,
      message,
      null,
      context
    )
    return replaceString(msg, null, data)
  }

  tx: TranslateJsxFunc = (message, data, context) => {
    const msg = getTranslation(
      this.props.translations,
      this.state.locale,
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
      this.props.translations,
      this.state.locale,
      count,
      singular,
      plural,
      context
    )
    return replaceString(message, count, data)
  }

  tnx: TranslatePluralJsxFunc = (count, singular, plural, data, context) => {
    const message = getTranslation(
      this.props.translations,
      this.state.locale,
      count,
      singular,
      plural,
      context
    )
    return replaceJsx(message, null, data).map((el, idx) => (
      <React.Fragment key={idx} children={el} />
    ))
  }

  setLocale = (lang: string) => {
    this.setState({ lang })
  }

  render() {
    const value = {
      t: this.t,
      tx: this.tx,
      tn: this.tn,
      tnx: this.tnx,
      locale: this.state.locale,
      setLocale: this.setLocale,
    }
    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    )
  }
}
