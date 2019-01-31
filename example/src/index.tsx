import React from 'react'
import ReactDOM from 'react-dom'
import I18nStore from './react-i18n/store'
import I18nProvider from './react-i18n/component'
import I18nContext from './react-i18n/context'

const translations = require('./translations.json')

const store = new I18nStore({
  translations,
  locale: 'da',
})

ReactDOM.render(
  <I18nProvider store={store}>
    <I18nContext.Consumer>
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
              {tx('Hello {name}', {
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
    </I18nContext.Consumer>
  </I18nProvider>,
  document.getElementById('root') as HTMLElement
)
