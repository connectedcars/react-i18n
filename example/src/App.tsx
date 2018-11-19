import React, { Component } from 'react'
import * as PropTypes from 'prop-types'
import './App.css'

const logo = require('./logo.svg')

class App extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    tn: PropTypes.func.isRequired,
  }

  render() {
    const { t, tn } = this.context

    const daysAgo = (days: number) => tn(days, '{n} day ago', '{n} days ago')

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>{t('Hello {name}', { name: 'Mikkel' })}</h2>
        </div>
        <p className="App-intro">
          {daysAgo(1)}, {daysAgo(2)}
        </p>
        <div>
          {t('Current language:')}
        </div>
        <div>
          {t(`Multiple
              Lines
              Also
              Works`)}
        </div>
      </div>
    )
  }
}

export default App
