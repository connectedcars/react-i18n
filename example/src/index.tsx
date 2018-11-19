import React, { createContext, PureComponent, ReactChild } from 'react'
import ReactDOM from 'react-dom'
// import App from './App'
import './index.css'

const translations = require('./translations.json')

// type TranslateFunc = (text: string, data?: object, context?: string) => string
export type TranslateFunc = (
  text: string,
  data?: Record<string, any>,
  context?: string
) => string
export type TranslateJsxFunc = (
  text: string,
  data?: Record<string, ReactChild>,
  context?: string
) => string[]

interface Context {
  // translations: Record<string, Record<string, string | string[]>>
  lang: string
  setLanguage: (lang: string) => void
  t: TranslateFunc
  tx: TranslateJsxFunc
}

const noop = () => {} // tslint:disable-line:no-empty

const Context = createContext<Context>({
  lang: '',
  setLanguage: noop,
  t: noop as any,
  tx: noop as any,
})

class Provider extends PureComponent<{
  translations: any
  defaultLang: string
}> {
  state = {
    lang: this.props.defaultLang,
  }

  t: TranslateFunc = (text, data, context) => {
    return replaceString(text, null, data)
  }

  tx: TranslateJsxFunc = (text, data, context) => {
    return replaceJsx(text, null, data)
  }

  setLanguage = (lang: string) => {
    this.setState({ lang })
  }

  render() {
    const value = {
      lang: this.state.lang,
      t: this.t,
      tx: this.tx,
      setLanguage: this.setLanguage,
    }
    return (
      <Context.Provider value={value}>{this.props.children}</Context.Provider>
    )
  }
}

const replaceString = (text: string, count: number | null, data?: object) => {
  let ourData: any = data || {}
  ourData.n = ourData.n || count
  Object.keys(ourData).map(key => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), ourData[key])
  })
  return text
}

const replaceJsx = (text: string, count: number | null, data?: object) => {
  const ourData: any = data || {}
  const keys = Object.keys(ourData).join('|')
  const entries = text.split(new RegExp(`({${keys}})`, 'g')).map(entry => {
    // Check if the first character is a bracket. It's a little faster than looking up in a map.
    if (entry[0] !== '{') {
      return entry
    }
    // Cut off the `{` and `}`
    const key = entry.substring(1, entry.length - 1)
    const match = ourData[key]
    if (!match) {
      return entry
    }
    return match
  })

  return entries
}

ReactDOM.render(
  <Provider translations={translations} defaultLang="da">
    <>
      <Context.Consumer>
        {props => {
          return (
            <React.Fragment>
              <div>{props.t('Hello {world}', { world: 'world!' })}</div>
              <div>
                {props.tx('Hello {jsx}', { jsx: <strong>world!</strong> })}
              </div>
            </React.Fragment>
          )
        }}
      </Context.Consumer>
      {/* <App /> */}
    </>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
