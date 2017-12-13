import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import { getTranslation, replace, Translations } from '../translate'

const DEFAULT_LANG = 'en'

export interface ProviderProps {
  lang?: string
  translations: Translations
}

class Provider extends Component<ProviderProps> {
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

  getChildContext() {
    const { lang, translations } = this.props
    return {
      t: this.translate(translations, lang),
      tn: this.ntranslate(translations, lang)
    }
  }

  translate = (translations: Translations, lang: string = DEFAULT_LANG) => {
    return (text: string, data?: Object, context?: string) => {
      const str = getTranslation(translations, lang)(0, text, null, context)
      return replace(str, 0, data)
    }
  }

  ntranslate = (translations: Translations, lang: string = DEFAULT_LANG) => {
    return (n: number, text: string, textPlural: string, data?: Object, context?: string | null) => {
      const str = getTranslation(translations, lang)(n, text, textPlural, context)
      return replace(str, n, data)
    }
  }

  render() {
    return this.props.children
  }
}

export default Provider
