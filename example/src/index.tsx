import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {
  I18nStore,
  I18nProvider,
  I18nContext,
  I18nConsumer,
  withTranslate,
} from '@connectedcars/react-i18n'
import ToggleLocale from './ToggleLocales'

const store = new I18nStore({
  translations: require('./translations.json'),
  locale: 'da',
})

class ExampleA extends React.Component {
  static contextType = I18nContext

  render() {
    return <div>{this.context.t('Hello {name}', { name: 'World' })}</div>
  }
}

class ExampleB extends React.Component {
  render() {
    return (
      <I18nConsumer>
        {i18n => {
          return <div>{i18n.t('Hello {name}', { name: 'World' })}</div>
        }}
      </I18nConsumer>
    )
  }
}

const ExampleC = withTranslate(props => {
  return <div>{props.t('Hello {name}', { name: 'World' })}</div>
})

const App = () => (
  <React.Fragment>
    <ExampleA />
    <ExampleB />
    <ExampleC />
    <ToggleLocale />
  </React.Fragment>
)

ReactDOM.render(
  <I18nProvider store={store}>
    <App />
  </I18nProvider>,
  document.getElementById('root')
)
