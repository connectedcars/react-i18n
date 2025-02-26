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

const opts: TranslationOptions = { defaultLocale: 'en' }

describe('translate', () => {
  describe('translates from translations set', () => {
    it('translate a singular string', () => {
      expect(
        getTranslation(translationData, 'da', null, 'hello', null, null, opts)
      ).toMatch('hej')
    })

    it('translate a plural string', () => {
      const output = getTranslation(
        translationData,
        'da',
        3,
        '{n} day',
        '{n} days',
        null,
        opts
      )
      const replaced = replaceString(output, { n: 3 })
      expect(replaced).toMatch('3 dage')
    })

    it('translates with fallback country code', () => {
      expect(
        getTranslation(translationData, 'en', null, 'bye', null, null, opts)
      ).toMatch('bye')
      expect(
        getTranslation(translationData, 'da', null, 'bye', null, null, opts)
      ).toMatch('farvel')
      expect(
        getTranslation(translationData, 'da_DK', null, 'bye', null, null, opts)
      ).toMatch('farvel')
      expect(
        getTranslation(translationData, 'da_GL', null, 'bye', null, null, opts)
      ).toMatch('farvel')
      expect(
        getTranslation(
          translationData,
          'fr_FR',
          null,
          'hello',
          null,
          null,
          opts
        )
      ).toMatch('bonjour')
      expect(
        getTranslation(translationData, 'fr_XX', null, 'bye', null, null, opts)
      ).toMatch('au revoir')
      expect(
        getTranslation(translationData, 'fr', null, 'bye', null, null, opts)
      ).toMatch('au revoir')
      expect(
        getTranslation(translationData, 'de', null, 'bye', null, null, opts)
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
        getTranslation(set, 'test', null, 'a fish', null, null, opts)
      ).toMatch('un poisson')
      expect(
        getTranslation(
          set,
          'test_underscore',
          null,
          'a goldfish',
          null,
          null,
          opts
        )
      ).toMatch('un poisson rouge')
      expect(
        getTranslation(set, 'test-hyphen', null, 'a shark', null, null, opts)
      ).toMatch('un requin')
      expect(
        getTranslation(set, 'test_undefined', null, 'test', null, null, opts)
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
      expect(getTranslation(set, 'zh_TW', 0, '{n} user', '{n} users')).toMatch(
        '{n} 用户'
      )
      expect(getTranslation(set, 'zh_TW', 1, '{n} user', '{n} users')).toMatch(
        '{n} 用户'
      )
      expect(getTranslation(set, 'zh_TW', 2, '{n} user', '{n} users')).toMatch(
        '{n} 用户'
      )
    })

    it.only('falls back on default language', () => {
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
        getTranslation(set, 'en', null, 'hi', null, null, {
          defaultLocale: 'en',
        })
      ).toMatch('hi')
      expect(
        getTranslation(set, 'en_AU', null, 'hi', null, null, {
          defaultLocale: 'en',
        })
      ).toMatch('oi')
      expect(
        getTranslation(set, 'en_GB', null, 'hi', null, null, {
          defaultLocale: 'en_AU',
        })
      ).toMatch('hai')
      expect(
        getTranslation(set, 'en', null, 'hi', null, null, {
          defaultLocale: 'en_AU',
        })
      ).toMatch('oi')
      expect(
        getTranslation(set, 'invalid', null, 'hi', null, null, {
          defaultLocale: 'en_AU',
        })
      ).toMatch('hi')
    })
  })

  describe('fails on missing plural data', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => opts)
    })

    it('fail on a plural string', () => {
      const logSpy = jest.spyOn(console, 'warn')
      getTranslation(
        translationDataLowercase,
        'da',
        3,
        '{n} day',
        '{n} days',
        null,
        { verbose: true, defaultLocale: 'en' }
      )
      expect(logSpy).toHaveBeenCalledWith(
        'translations are missing Plural-Forms setting'
      )
    })
  })
})
