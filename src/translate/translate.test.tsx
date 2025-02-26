import { TranslationOptions, Translations } from '../types'
import { replaceString } from './replace-content'
import { getTranslation } from './translate'

const translationData: Translations = {
  da: {
    '': {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Plural-Forms': 'nplurals=2; plural=(n != 1);',
      Language: 'da_DK',
    },
    hello: [null, 'hej'],
    bye: [null, 'farvel'],
    '{n} day': ['{n} days', '{n} dag', '{n} dage'],
  },
  da_DK: {
    hello: [null, 'HEJ!'],
  },
  fr_FR: {
    hello: [null, 'bonjour'],
    bye: [null, 'au revoir'],
  },
  fr_XX: {
    hello: [null, 'salut'],
  },
  en_AU: {
    hello: [null, 'oi'],
  },
}

const translationDataLowercase: Translations = {
  da: {
    '': {
      'content-type': 'text/plain; charset=UTF-8',
      // Note `plural-forms` is lowercase! We only support `Plural-Forms` casing currently.
      'plural-forms': 'nplurals=2; plural=(n != 1);',
      language: 'da_DK',
    },
    '{n} day': ['{n} days', '{n} dag', '{n} dage'],
  },
}

const defaultLocale = 'en'
const options: TranslationOptions = {}

describe('translate', () => {
  describe('translates from translations set', () => {
    it('translate a singular string', () => {
      expect(
        getTranslation({
          translations: translationData,
          locale: 'da',
          defaultLocale,
          n: null,
          singular: 'hello',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('hej')
    })

    it('translate a plural string', () => {
      const output = getTranslation({
        translations: translationData,
        locale: 'da',
        defaultLocale,
        n: 3,
        singular: '{n} day',
        plural: '{n} days',
        context: null,
        options,
      })
      const replaced = replaceString(output, { n: 3 })
      expect(replaced).toMatch('3 dage')
    })

    it('translates with fallback country code', () => {
      expect(
        getTranslation({
          translations: translationData,
          locale: 'en',
          defaultLocale,
          n: null,
          singular: 'bye',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('bye')
      expect(
        getTranslation({
          translations: translationData,
          locale: 'da',
          defaultLocale,
          n: null,
          singular: 'bye',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('farvel')
      expect(
        getTranslation({
          translations: translationData,
          locale: 'da_DK',
          defaultLocale,
          n: null,
          singular: 'bye',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('farvel')
      expect(
        getTranslation({
          translations: translationData,
          locale: 'da_GL',
          defaultLocale,
          n: null,
          singular: 'bye',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('farvel')
      expect(
        getTranslation({
          translations: translationData,
          locale: 'fr_FR',
          defaultLocale,
          n: null,
          singular: 'hello',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('bonjour')
      expect(
        getTranslation({
          translations: translationData,
          locale: 'fr_XX',
          defaultLocale,
          n: null,
          singular: 'bye',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('au revoir')
      expect(
        getTranslation({
          translations: translationData,
          locale: 'fr',
          defaultLocale,
          n: null,
          singular: 'bye',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('au revoir')
      expect(
        getTranslation({
          translations: translationData,
          locale: 'de',
          defaultLocale,
          n: null,
          singular: 'bye',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('bye')
    })

    it('translates with different formats', () => {
      const set: Translations = {
        test: {
          test: [null, 'test!'],
          'a fish': [null, 'un poisson'],
        },
        test_underscore: {
          test: [null, 'test_underscore'],
          'a goldfish': [null, 'un poisson rouge'],
        },
        'test-hyphen': {
          test: [null, 'test-hypeh'],
          'a shark': [null, 'un requin'],
        },
      }

      expect(
        getTranslation({
          translations: set,
          locale: 'test',
          defaultLocale,
          n: null,
          singular: 'a fish',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('un poisson')
      expect(
        getTranslation({
          translations: set,
          locale: 'test_underscore',
          defaultLocale,
          n: null,
          singular: 'a goldfish',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('un poisson rouge')
      expect(
        getTranslation({
          translations: set,
          locale: 'test-hyphen',
          defaultLocale,
          n: null,
          singular: 'a shark',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('un requin')
      expect(
        getTranslation({
          translations: set,
          locale: 'test_undefined',
          defaultLocale,
          n: null,
          singular: 'test',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('test!')
    })

    it('translates without plurals', () => {
      const set: Translations = {
        zh_TW: {
          '': {
            'Content-Type': 'text/plain; charset=UTF-8',
            'Plural-Forms': 'nplurals=1; plural=0;',
            Language: 'zh_TW',
          },
          '{n} user': ['{n} users', ['{n} 用户']],
        },
      }
      expect(
        getTranslation({
          translations: set,
          locale: 'zh_TW',
          defaultLocale,
          n: 0,
          singular: '{n} user',
          plural: '{n} users',
          options,
        })
      ).toMatch('{n} 用户')
      expect(
        getTranslation({
          translations: set,
          locale: 'zh_TW',
          defaultLocale,
          n: 1,
          singular: '{n} user',
          plural: '{n} users',
          options,
        })
      ).toMatch('{n} 用户')
      expect(
        getTranslation({
          translations: set,
          locale: 'zh_TW',
          defaultLocale,
          n: 2,
          singular: '{n} user',
          plural: '{n} users',
          options,
        })
      ).toMatch('{n} 用户')
    })

    it('falls back on default language', () => {
      const set: Translations = {
        en_GB: {
          '': {
            'Content-Type': 'text/plain; charset=UTF-8',
            'Plural-Forms': 'nplurals=2; plural=(n != 1);',
          },
          hi: [null, 'hai'],
        },
        en_AU: {
          '': {
            'Content-Type': 'text/plain; charset=UTF-8',
            'Plural-Forms': 'nplurals=2; plural=(n != 1);',
          },
          hi: [null, 'oi'],
        },
      }
      expect(
        getTranslation({
          translations: set,
          locale: 'en',
          defaultLocale: 'en',
          n: null,
          singular: 'hi',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('hi')
      expect(
        getTranslation({
          translations: set,
          locale: 'en_AU',
          defaultLocale: 'en',
          n: null,
          singular: 'hi',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('oi')
      expect(
        getTranslation({
          translations: set,
          locale: 'en_GB',
          defaultLocale: 'en_AU',
          n: null,
          singular: 'hi',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('hai')
      expect(
        getTranslation({
          translations: set,
          locale: 'en',
          defaultLocale: 'en_AU',
          n: null,
          singular: 'hi',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('oi')
      expect(
        getTranslation({
          translations: set,
          locale: 'invalid',
          defaultLocale: 'en_AU',
          n: null,
          singular: 'hi',
          plural: null,
          context: null,
          options,
        })
      ).toMatch('hi')
    })
  })

  describe('fails on missing plural data', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => options)
    })

    it('fail on a plural string', () => {
      const logSpy = jest.spyOn(console, 'warn')
      getTranslation({
        translations: translationDataLowercase,
        locale: 'da',
        defaultLocale: 'en',
        n: 3,
        singular: '{n} day',
        plural: '{n} days',
        context: null,
        options: { verbose: true },
      })
      expect(logSpy).toHaveBeenCalledWith(
        'translations are missing Plural-Forms setting'
      )
    })
  })
})
