import { Translations } from './types'

export interface I18nStoreState {
  locale: string
  translations: Translations
}

export type I18nStoreCallback = (opts: I18nStoreState) => void

class I18nStore {
  private listeners: I18nStoreCallback[]
  private translations: Translations
  private locale: string

  constructor({ translations, locale }: I18nStoreState) {
    this.listeners = []
    this.translations = translations
    this.locale = locale
  }

  setLocale = (locale: string) => {
    if (locale !== this.locale) {
      this.locale = locale
      this.triggerUpdate()
    }
  }

  setTranslations = (translations: Translations) => {
    if (translations !== this.translations) {
      this.translations = translations
      this.triggerUpdate()
    }
  }

  triggerUpdate = () => {
    this.listeners.forEach(listener => {
      listener(this.getState())
    })
  }

  getState = (): I18nStoreState => {
    return {
      translations: this.translations,
      locale: this.locale,
    }
  }

  subscribe = (cb: I18nStoreCallback) => {
    this.listeners.push(cb)

    return () => {
      this.unsubscribe(cb)
    }
  }

  unsubscribe = (cb: I18nStoreCallback) => {
    const index = this.listeners.indexOf(cb)
    if (~index) {
      this.listeners.splice(index, 1)
    }
  }
}

export { I18nStore }
