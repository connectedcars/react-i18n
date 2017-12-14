# @connectedcars/react-i18n

Work in progress.

## Todo
- [ ] fuzzy translations
- [ ] improve documentation

## Installation

`npm install @connectedcars/react-i18n`

## Usage

See the `example` project located in the `example` folder.

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
