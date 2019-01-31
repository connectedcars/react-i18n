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
import I18nStore, { I18nStoreState } from './store'
import I18nContext from './context'

interface ProviderProps {
  store: I18nStore
  options?: TranslationOptions
}

interface ProviderState {
  storeState: I18nStoreState
}

class I18nProvider extends PureComponent<ProviderProps, ProviderState> {
  private _isMounted: boolean = false
  private unsubscribe?: () => void

  constructor(props: ProviderProps) {
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
    const { locale, translations } = this.state.storeState
    const { setLocale, setTranslations } = this.props.store

    const value: I18nContext = {
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

export default I18nProvider
