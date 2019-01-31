import React from 'react'
import ReactDOM from 'react-dom'
import { Context, Provider, TranslationStore } from './react-i18n/component'

const translations = require('./translations.json')

const store = new TranslationStore(translations, 'da')

ReactDOM.render(
  <Provider store={store}>
    <Context.Consumer>
      {({ t, tx, tn, tnx, locale, setLocale }) => {
        const swapLocale = locale === 'da' ? 'en' : 'da'

        return (
          <React.Fragment>
            <button onClick={() => setLocale(swapLocale)}>
              {t('Set to {nextLang}', { nextLang: swapLocale.toUpperCase() })}
            </button>

            <div>
              {t('Hello {name}', {
                name: 'world!',
              })}
            </div>

            <div>
              {tx('Hello <name />', {
                name: () => <strong>world!</strong>,
              })}
            </div>

            <div>{tn(1, '{n} day ago', '{n} days ago')}</div>
            <div>{tn(2, '{n} day ago', '{n} days ago')}</div>

            <div>
              {tnx(1, '{n} day ago', '{n} days ago', {
                n: () => <strong>1</strong>,
              })}
            </div>
            <div>
              {tnx(2, '{n} day ago', '{n} days ago', {
                n: () => <strong>2</strong>,
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
                <paragraph red>This is a test (<n/>/<n />/{n})</paragraph>
                <paragraph green>This is <strong>a nested</strong> paragraph</paragraph>
                <i><strong>foobar</strong></i>
              `,
                {
                  n: 1234,
                  paragraph: (content, attrs) => (
                    <p style={{ color: attrs }}>{content}</p>
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
