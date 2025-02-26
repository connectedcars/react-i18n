import React, { PureComponent } from 'react'

import { I18nContext, I18nContextProps } from './context'
import { I18nStore, I18nStoreState } from './store'
import { getTranslation, replaceJsx, replaceString } from './translate'
import {
  TranslateDataWithJSX,
  TranslateFunc,
  TranslateJsxFunc,
  TranslatePluralFunc,
  TranslatePluralJsxFunc,
  TranslationOptions,
  Translations,
} from './types'

interface I18nProviderProps {
  store: I18nStore
  options?: TranslationOptions
  children: React.ReactNode
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
    },
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

  setTranslations = (translations: Translations) => {
    return this.props.store.setTranslations(translations)
  }

  setLocale = (locale: string) => {
    return this.props.store.setLocale(locale)
  }

  t: TranslateFunc = (message, data, context) => {
    const msg = getTranslation({
      translations: this.state.storeState.translations,
      locale: this.state.storeState.locale,
      defaultLocale: this.state.storeState.defaultLocale,
      n: null,
      singular: message,
      plural: null,
      context,
      options: this.props.options,
    })

    return replaceString(msg, this.genData(data), this.props.options)
  }

  tx: TranslateJsxFunc = (message, data, context) => {
    const msg = getTranslation({
      translations: this.state.storeState.translations,
      locale: this.state.storeState.locale,
      defaultLocale: this.state.storeState.defaultLocale,
      n: null,
      singular: message,
      plural: null,
      context,
      options: this.props.options,
    })

    return replaceJsx(msg, this.genData(data), this.props.options).map(
      (el, idx) => <React.Fragment key={idx}>{el}</React.Fragment>
    )
  }

  tn: TranslatePluralFunc = (count, singular, plural, data, context) => {
    const message = getTranslation({
      translations: this.state.storeState.translations,
      locale: this.state.storeState.locale,
      defaultLocale: this.state.storeState.defaultLocale,
      n: count,
      singular,
      plural,
      context,
      options: this.props.options,
    })

    return replaceString(message, this.genData(data, count), this.props.options)
  }

  tnx: TranslatePluralJsxFunc = (count, singular, plural, data, context) => {
    const message = getTranslation({
      translations: this.state.storeState.translations,
      locale: this.state.storeState.locale,
      defaultLocale: this.state.storeState.defaultLocale,
      n: count,
      singular,
      plural,
      context,
      options: this.props.options,
    })

    return replaceJsx(
      message,
      this.genData(data, count),
      this.props.options
    ).map((el, idx) => <React.Fragment key={idx}>{el}</React.Fragment>)
  }

  genData = (data: TranslateDataWithJSX, count?: number) => {
    const whitelist = this.props.options.jsxWhitelist
    if (count != null) {
      return {
        ...whitelist,
        n: count,
        ...data,
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
