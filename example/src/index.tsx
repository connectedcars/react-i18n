import React from 'react'
import ReactDOM from 'react-dom'
import { Context, Provider } from './react-i18n/component'

const translations = require('./translations.json')

ReactDOM.render(
  <Provider translations={translations} locale="da">
    <Context.Consumer>
      {({ t, tx, tn, tnx }) => {
        return (
          <React.Fragment>
            <div>
              {t('Hello {name}', {
                name: 'world!',
              })}
            </div>

            <div>
              {tx('Hello {name}', {
                name: <strong>world!</strong>,
              })}
            </div>

            <div>{tn(1, '{n} day ago', '{n} days ago')}</div>
            <div>{tn(2, '{n} day ago', '{n} days ago')}</div>

            <div>
              {tnx(1, '{n} day ago', '{n} days ago', {
                n: <strong>1</strong>,
              })}
            </div>
            <div>
              {tnx(2, '{n} day ago', '{n} days ago', {
                n: <strong>2</strong>,
              })}
            </div>
            <div>{t('Translation with context', null, 'hello')}</div>
            <div>
              {t(`
                This
                is
                a
                multi-line
                test.
              `)}
            </div>
            <div>
              {tx(
                `
                ![This is a multiline test](paragraph)
                ![With multiple paragraphs](paragraph)
                ![Using React Components](paragraph)
                ![This is a link](link)
              `,
                {
                  link: text => (
                    <a
                      href="http://google.com"
                      onClick={e => {
                        e.preventDefault()
                        alert('nope')
                      }}
                    >
                      {text}
                    </a>
                  ),
                  paragraph: text => (
                    <p style={{ color: 'red' }}>
                      <strong>{text}</strong>
                    </p>
                  ),
                }
              )}
            </div>
          </React.Fragment>
        )
      }}
    </Context.Consumer>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
