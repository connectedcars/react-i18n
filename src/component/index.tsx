import React, { Component } from 'react'
import * as PropTypes from 'prop-types'

export interface Translations {
  [lang: string]: Object
}

export interface ProviderProps {
  lang?: string
  translations: Translations
}

class Provider extends Component<ProviderProps> {
  static childContextTypes = {
    t: PropTypes.func.isRequired
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
      t: this.translate(lang || 'en', translations)
    }
  }

  translate = (lang: string, translations: Translations) => (text: string) => {
    return translations[lang][text]
  }

  render() {
    return this.props.children
  }
}

export default Provider
