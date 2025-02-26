[![npm version](https://badge.fury.io/js/@connectedcars%2Freact-i18n.svg)](https://www.npmjs.com/package/@connectedcars/react-i18n)
# @connectedcars/react-i18n

## Installation

`npm install @connectedcars/react-i18n`

## Usage

See the `example` project located in the `example` folder. In particular how the context is setup.

Then a translator can be picked up from the context.

`const {t} = this.context`

Where `t` returns a translated string.

Translate a simple piece of text:

`t('This text should be translated')`

Translate text containing a variable:

`t('This {word} is in a translated sentence.', { word: 'Variable'})`

Translate plurals (`n` is injected into the data object, but can be overwritten):

`tn(count, '{n} time', '{n} times')`

Multiple lines are also supported using template strings (however, **DO NOT** use `${}` variables!):

```
t(`Foo
   bar
   baz`)
```

*Please note, however, that these translations will not be rendered on multiple lines in HTML!*

Translate with React:

```
// Use `tnx` for plurals with JSX!
tx(`
  <p>Hello, <strong>{name}</strong></p>
  <p>Today is {day}</p>
`, {
  p: content => <p>{content}</p>,
  strong: content => <strong>{content}</strong>,
  name: 'John Doe',
  day: 'Monday'
})
```

*Please note, by default translations are in strict mode which means an error will be thrown on undefined types*
*Please note, it is possible to add a whitelist/default by setting `jsxWhitelist` on the `I18nPovider`.*

You can also add a context to your translations:

`t('Hello', null, 'context here')`

## Import and Export

First you need to set up the import and export scripts in your `package.json`
```
...

"scripts": {
  "import": "i18n-import",
  "export": "i18n-export",
}

...
```

Then you can run the following commands:
* `npm run export` creates a POT file with the extracted translations in `./locales/template.pot`
* `npm run import` creates a json file containing your all your translations in `./src/translations.json`

Running `npm run import --stripCountry` will strip the country code in the resulting file, ie. the key `da_DK` will become `da`.

## CI

To get output for CI, add the following script:
```
  "ci-translation": "i18n-translation-status"
```

## Linting

See our eslint plugin: https://github.com/connectedcars/eslint-plugin-react-i18n

## Example
```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import {
  I18nStore,
  I18nProvider,
  I18nContext,
  I18nConsumer,
  useTranslate,
  withTranslate,
} from '@connectedcars/react-i18n'
import './index.css'

const translations = {
  "da": {
    "": {
      "content-type": "text/plain; charset=UTF-8",
      "project-id-version": "",
      "pot-creation-date": "",
      "po-revision-date": "",
      "language-team": "",
      "mime-version": "1.0",
      "content-transfer-encoding": "8bit",
      "x-generator": "Poedit 2.0.6",
      "last-translator": "",
      "plural-forms": "nplurals=2; plural=(n != 1);",
      "language": "da"
    },
    "Hello {name}": [
      null,
      "Hej {name}"
    ],
    "Set language to <lang />": [
      null,
      "Skift sprog til <lang />"
    ]
  }
}

const store = new I18nStore({
  translations,
  locale: 'da',
  defaultLocale: 'en',
})

class ExampleA extends React.Component {
  static contextType = I18nContext

  render() {
    return <div>{this.context.t('Hello {name}', { name: 'World' })}</div>
  }
}

class ExampleB extends React.Component {
  render() {
    return (
      <I18nConsumer>
        {i18n => {
          return <div>{i18n.t('Hello {name}', { name: 'World' })}</div>
        }}
      </I18nConsumer>
    )
  }
}

const ExampleC = withTranslate(props => {
  return <div>{props.t('Hello {name}', { name: 'World' })}</div>
})

const ExampleD: React.FC = props => {
  const { tx } = useTranslate()

  return (
    <div>
      {tx('<strong>Hello</strong> there <link>test</link>', {
        strong: content => <strong>{content}</strong>,
        link: content => <a href="https://example.com">{content}</a>
      })}
    </div>
  )
}

const ToggleLocale: React.FC = () => {
  const { tx, setLocale, locale } = useTranslate()
  const swapLocale = locale === 'da' ? 'en' : 'da'

  return (
    <button onClick={() => setLocale(swapLocale)}>
      {tx('Set language to <lang />', {
        lang: (content, attr) => <strong>{swapLocale}</strong>,
      })}
    </button>
  )
}

ReactDOM.render(
  <I18nProvider store={store}>
    <ExampleA />
    <ExampleB />
    <ExampleC />
    <ExampleD />
    <ToggleLocale />
  </I18nProvider>,
  document.getElementById('root')
)
```
