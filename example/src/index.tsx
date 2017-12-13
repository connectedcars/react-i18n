import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

import { Provider as I18NProvider } from 'cc-i18n'

const translations = require('./translations.json')

ReactDOM.render(
  <I18NProvider lang="da" translations={translations}>
    <App />
  </I18NProvider>,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
