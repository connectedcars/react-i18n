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
  <p>Hello, <strong>{name}</strong><p>
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

## CI

To get output for CI, add the following script:
```
  "ci-translation": "i18n-translation-status"
```
