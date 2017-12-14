import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { setLanguage } from '@connectedcars/react-i18n'

interface AppProps {
  lang?: string
}

interface DispatchProps {
  updateLanguage?(lang: string): void
}

interface Props extends DispatchProps, AppProps {}

class LanguageSelector extends Component<Props> {
  dispatchLanguage = (e: React.FormEvent<HTMLSelectElement>) => {
    const { updateLanguage } = this.props
    if (updateLanguage) {
      updateLanguage(e.currentTarget.value)
    }
  }

  render() {
    return (
      <select value={this.props.lang} onChange={this.dispatchLanguage}>
        {['en', 'da'].map(lang => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    )
  }
}

const mapStateToProps = (state: any): AppProps => ({
  lang: state.i18n.lang
})

const mapDispatchToProps = (dispatch: Dispatch<{}>): DispatchProps => ({
  updateLanguage: (lang: string) =>
    dispatch(setLanguage(lang))
})

export default connect<AppProps, DispatchProps, AppProps>(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelector)
