import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import { getTranslation, replace, Translations } from '../translate'
import { TranslateFunc, TranslatePluralFunc } from '../types';

export interface ProviderProps {
  lang?: string
  initialLang?: string
  translations: Translations
  setLanguage?(lang: string): void
}

export class Provider extends Component<ProviderProps> {
  static childContextTypes = {
    t: PropTypes.func.isRequired,
    tn: PropTypes.func.isRequired
  }

  static propTypes = {
    translations: PropTypes.object.isRequired,
    lang: PropTypes.string
  }

  static defaultProps = {
    lang: 'en'
  }

  componentWillMount() {
    const { setLanguage, initialLang } = this.props
    if (setLanguage && initialLang) {
      setLanguage(initialLang)
    }
  }

  getChildContext() {
    const { lang, translations } = this.props
    return {
      t: this.translate(translations, lang),
      tn: this.ntranslate(translations, lang),
      // TODO. Add support for JSX replacement.
      tx: null,
      tnx: null
    }
  }

  translate = (translations: Translations, lang?: string): TranslateFunc => {
    return (text: string, data?: object, context?: string) => {
      const str = getTranslation(translations, lang, 0, text, null, context)
      return replace(str, 0, data)
    }
  }

  ntranslate = (translations: Translations, lang?: string): TranslatePluralFunc => {
    return (n: number, text: string, textPlural: string, data?: object, context?: string | null) => {
      const str = getTranslation(translations, lang, n, text, textPlural, context)
      return replace(str, n, data)
    }
  }

  render() {
    return this.props.children
  }
}
