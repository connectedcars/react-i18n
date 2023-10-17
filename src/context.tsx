import { createContext } from 'react'

import {
  TranslateFunc,
  TranslateJsxFunc,
  TranslatePluralFunc,
  TranslatePluralJsxFunc,
  Translations,
} from './types'

export interface I18nContextProps {
  t: TranslateFunc
  tx: TranslateJsxFunc
  tn: TranslatePluralFunc
  tnx: TranslatePluralJsxFunc
  locale: string
  setLocale: (lang: string) => void
  translations: Translations
  setTranslations: (translations: Translations) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noop = (): any => {}

const I18nContext = createContext<I18nContextProps>({
  t: noop,
  tx: noop,
  tn: noop,
  tnx: noop,
  locale: 'en',
  setLocale: noop,
  translations: {},
  setTranslations: noop,
})

export { I18nContext }
