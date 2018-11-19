import React, { createContext } from 'react'

interface Context {
  lang: string
  setLanguage: (lang: string) => void
  t: () => void // TranslateFunc
  tn: () => void // TranslatePluralFunc
}

const Context = createContext<Context>({
  lang: 'da',
  setLanguage: () => {},
  t: () => {},
  tn: () => {},
})

// i18n provider
const Provider = () => {}

// <Consumer>{props => props.t('foobar')}</Consumer>
const Consumer = () => {}

const withTranslate = () => {}

const withLanguage = () => {}

