import React from 'react'
import ReactDOM from 'react-dom'
import { Context, Provider } from './react-i18n/component'

const translations = require('./translations.json')

ReactDOM.render(
  <Provider translations={translations} locale="da">
    <Context.Consumer>
      {props => {
        return (
          <React.Fragment>
            <div>{props.t('Hello {name}', { name: 'world!' })}</div>

            <div>
              {props.tx('Hello {name}', { name: <strong>world!</strong> })}
            </div>

            <div>{props.tn(1, '{n} day ago', '{n} days ago')}</div>
            <div>{props.tn(2, '{n} day ago', '{n} days ago')}</div>

            <div>
              {props.tnx(1, '{n} day ago', '{n} days ago', {
                n: <strong>1</strong>,
              })}
            </div>
            <div>
              {props.tnx(2, '{n} day ago', '{n} days ago', {
                n: <strong>2</strong>,
              })}
            </div>
          </React.Fragment>
        )
      }}
    </Context.Consumer>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
