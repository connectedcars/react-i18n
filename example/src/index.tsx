import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import I18n, { i18nReducer } from '@connectedcars/react-i18n'

const translations = require('./translations.json')

const appReducer = combineReducers({
  i18n: i18nReducer
})
const store = createStore(appReducer)

ReactDOM.render(
  <Provider store={store}>
    <I18n translations={translations} initialLang="da">
      <App />
    </I18n>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
