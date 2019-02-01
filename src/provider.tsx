import React, { PureComponent } from 'react'
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
import { I18nStore, I18nStoreState } from './store'
import { I18nContext, I18nContextProps } from './context'

interface I18nProviderProps {
  store: I18nStore
  options?: TranslationOptions
}

interface I18nProviderState {
  storeState: I18nStoreState
}

class I18nProvider extends PureComponent<I18nProviderProps, I18nProviderState> {
  private _isMounted: boolean = false
  private unsubscribe?: () => void

  static defaultProps: Partial<I18nProviderProps> = {
    options: {
      strict: true,
    }
  }

  constructor(props: I18nProviderProps) {
    super(props)

    this.state = {
      storeState: props.store.getState(),
    }
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

  componentDidUpdate(prevProps: I18nProviderProps) {
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

      this.setState({ storeState: store.getState() })
    })
  }

  getTranslations = (): TranslationSet | undefined => {
    const { translations, locale } = this.state.storeState
    const tl = translations[locale]

    // Don't throw an error on `en` as this is the default language.
    if (locale !== 'en' && !tl) {
      throw new Error(`missing translation set for locale: ${locale}`)
    }

    return tl
  }

  setTranslations = (translations: Translations) => {
    return this.props.store.setTranslations(translations)
  }

  setLocale = (locale: string) => {
    return this.props.store.setLocale(locale)
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

    return replaceString(msg, this.genData(data))
  }

  tx: TranslateJsxFunc = (message, data, context) => {
    const strict = this.props.options.strict
    const msg = getTranslation(
      this.getTranslations(),
      null,
      message,
      null,
      context,
      this.props.options
    )

    return replaceJsx(msg, this.genData(data), strict).map((el, idx) => (
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

    return replaceString(message, this.genData(data, count))
  }

  tnx: TranslatePluralJsxFunc = (count, singular, plural, data, context) => {
    const strict = this.props.options.strict
    const message = getTranslation(
      this.getTranslations(),
      count,
      singular,
      plural,
      context,
      this.props.options
    )

    return replaceJsx(message, this.genData(data, count), strict).map((el, idx) => (
      <React.Fragment key={idx} children={el} />
    ))
  }

  genData = (data: Record<string, any>, count?: number) => {
    const whitelist = this.props.options.jsxWhitelist
    if (count != null) {
      return {
        ...whitelist,
        n: count,
        ...data
      }
    }
    return { ...whitelist, ...data }
  }

  render() {
    const { locale, translations } = this.state.storeState
    const { setLocale, setTranslations } = this.props.store

    const value: I18nContextProps = {
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
      <I18nContext.Provider value={value}>
        {this.props.children}
      </I18nContext.Provider>
    )
  }
}

export { I18nProvider }
