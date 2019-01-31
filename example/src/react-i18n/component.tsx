import React, { createContext, PureComponent } from 'react'
import {
  Translations,
  TranslateFunc,
  TranslateJsxFunc,
  TranslatePluralFunc,
  TranslatePluralJsxFunc,
  TranslationOptions,
  TranslationSet,
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

type CB = (opts: { translations: Translations; locale: string }) => void

export class TranslationStore {
  private listeners: CB[]
  private translations: Translations
  private locale: string

  constructor(translations: Translations, locale: string) {
    this.listeners = []
    this.translations = translations
    this.locale = locale
  }

  setLocale = (locale: string) => {
    this.locale = locale
    this.triggerUpdate()
  }

  setTranslations = (translations: Translations) => {
    this.translations = translations
    this.triggerUpdate()
  }

  triggerUpdate = () => {
    this.listeners.forEach(listener => {
      listener(this.getState())
    })
  }

  getState = () => {
    return {
      translations: this.translations,
      locale: this.locale,
    }
  }

  subscribe = (cb: CB) => {
    this.listeners.push(cb)

    return () => {
      this.unsubscribe(cb)
    }
  }

  unsubscribe = (cb: CB) => {
    const index = this.listeners.indexOf(cb)
    this.listeners.splice(index, 1)
  }
}

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
  // locale: string
  // translations: Translations
  store: TranslationStore
  options?: TranslationOptions
}

interface ProviderState {
  locale: string
  translations: Translations
}

export class Provider extends PureComponent<ProviderProps, ProviderState> {
  private _isMounted: boolean = false
  private unsubscribe?: () => void

  constructor(props: ProviderProps) {
    super(props)

    this.state = props.store.getState()
  }

  componentDidMount() {
    this._isMounted = true
    this.subscribe()
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  componentDidUpdate(prevProps: ProviderProps) {
    if (this.props.store !== prevProps.store) {
      if (this.unsubscribe) {
        this.unsubscribe()
      }

      this.subscribe()
    }
  }

  subscribe = () => {
    const { store } = this.props
    this.unsubscribe = store.subscribe(() => {
      if (!this._isMounted) {
        return
      }

      const { locale, translations } = store.getState()

      this.setState({
        locale,
        translations
      })
    })
  }

  getTranslations = (): TranslationSet | undefined => {
    const { translations, locale } = this.state
    const tl = translations[locale]

    // Don't throw an error on `en` as this is the default language.
    if (locale !== 'en' && !tl) {
      throw new Error(`missing translation set for locale: ${locale}`)
    }

    return tl
  }

  setTranslations = (translations: Translations) => {
    return this.props.store.setTranslations(translations)
    // this.setState({ translations })
  }

  setLocale = (locale: string) => {
    return this.props.store.setLocale(locale)
    // this.setState({ locale })
  }

  t: TranslateFunc = (message, data, context) => {
    const msg = getTranslation(
      this.getTranslations(),
      null,
      message,
      null,
      context,
      this.props.options
    )

    return replaceString(msg, data)
  }

  tx: TranslateJsxFunc = (message, data, context) => {
    const msg = getTranslation(
      this.getTranslations(),
      null,
      message,
      null,
      context,
      this.props.options
    )

    return replaceJsx(msg, data).map((el, idx) => (
      <React.Fragment key={idx} children={el} />
    ))
  }

  tn: TranslatePluralFunc = (count, singular, plural, data, context) => {
    const message = getTranslation(
      this.getTranslations(),
      count,
      singular,
      plural,
      context,
      this.props.options
    )

    return replaceString(message, { n: count, ...data })
  }

  tnx: TranslatePluralJsxFunc = (count, singular, plural, data, context) => {
    const message = getTranslation(
      this.getTranslations(),
      count,
      singular,
      plural,
      context,
      this.props.options
    )

    return replaceJsx(message, { n: count, ...data }).map((el, idx) => (
      <React.Fragment key={idx} children={el} />
    ))
  }

  render() {
    const { locale, translations } = this.state
    const { setLocale, setTranslations } = this.props.store

    const value: Context = {
      t: this.t,
      tx: this.tx,
      tn: this.tn,
      tnx: this.tnx,
      locale,
      setLocale,
      translations,
      setTranslations,
    }

    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    )
  }
}
