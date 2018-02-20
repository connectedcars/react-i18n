# @connectedcars/react-i18n

Work in progress.

## Todo
- [ ] fuzzy translations
- [ ] improve documentation

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
