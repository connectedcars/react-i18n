import {
  TranslateFunc,
  TranslateJsxFunc,
  TranslatePluralFunc,
  TranslatePluralJsxFunc,
  Translations,
} from './types'
import { createContext } from 'react'

interface I18nContext {
  t: TranslateFunc
  tx: TranslateJsxFunc
  tn: TranslatePluralFunc
  tnx: TranslatePluralJsxFunc

  locale: string
  setLocale: (lang: string) => void
  translations: Translations
  setTranslations: (translations: Translations) => void
}

const noop = (): any => {} // tslint:disable-line:no-empty

const I18nContext = createContext<I18nContext>({
  t: noop,
  tx: noop,
  tn: noop,
  tnx: noop,
  locale: 'en',
  setLocale: noop,
  translations: {},
  setTranslations: noop,
})

export default I18nContext
