import { TranslationSet } from '../types'
import { replaceString } from './replace-content'
import { getTranslation } from './translate'

const translationData: TranslationSet = {
  "": {
    "Content-Type": "text/plain; charset=UTF-8",
    "Plural-Forms": "nplurals=2; plural=(n != 1);",
    "Language": "da_DK",
  },
  "hello": [
    null,
    "hej"
  ],
  "{n} day": [
    "{n} days",
    "{n} dag",
    "{n} dage"
  ],
}

// Note `plural-forms` is lowercase!
const translationDataLowercase: TranslationSet = {
  "": {
    "content-type": "text/plain; charset=UTF-8",
    "plural-forms": "nplurals=2; plural=(n != 1);",
    "language": "da_DK",
  },
  "{n} day": [
    "{n} days",
    "{n} dag",
    "{n} dage"
  ],
}

describe('translates from translations set', () => {
  it('translate a singular string', () => {
    expect(getTranslation(translationData, null, 'hello', null, null, {})).toMatch('hej')
  })

  it('translate a plural string', () => {
    const output = getTranslation(translationData, 3, '{n} day', '{n} days', null, {})
    const replaced = replaceString(output, { n: 3 })
    expect(replaced).toMatch('3 dage')
  })
})

describe('fails on missing plural data', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  })

  it('fail on a plural string', () => {
    const logSpy = jest.spyOn(console, 'warn');
    getTranslation(translationDataLowercase, 3, '{n} day', '{n} days', null, {})
    expect(logSpy).toHaveBeenCalledWith('translations are missing Plural-Forms setting')
  })
})
