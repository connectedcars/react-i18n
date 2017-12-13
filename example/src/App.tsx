import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import './App.css'

const logo = require('./logo.svg')

class App extends Component<{}> {
  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  render() {
    const { t } = this.context
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{t('Hello')}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
