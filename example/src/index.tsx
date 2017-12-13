import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { ReduxProvider as I18NProvider, cci18n } from 'cc-i18n'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

const translations = require('./translations.json')

const appReducer = combineReducers({
  cci18n
})
const store = createStore(appReducer)

ReactDOM.render(
  <Provider store={store}>
    <I18NProvider translations={translations} initialLang="da">
      <App />
    </I18NProvider>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
