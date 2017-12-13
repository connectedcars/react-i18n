import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { Provider as I18NProvider } from 'cc-i18n'

const translations = {
  en: {
    'Hello': 'Hello'
  },
  da: {
    'Hello': 'Hej'
  },
  fr: {
    'Hello': 'Bonjour'
  }
}

ReactDOM.render(
  <I18NProvider lang="fr" translations={translations}>
    <App />
  </I18NProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
