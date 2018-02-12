import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import I18n, { i18nReducer, I18nState } from '@connectedcars/react-i18n'

export interface StoreState {
  i18n: I18nState
}

const translations = require('./translations.json')

const appReducer = combineReducers<StoreState>({
  i18n: i18nReducer
})
const store = createStore<StoreState>(appReducer)

ReactDOM.render(
  <Provider store={store}>
    <I18n translations={translations} initialLang="da">
      <App />
    </I18n>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
