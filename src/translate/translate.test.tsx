import { Translations } from '../types'
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

describe('translate', () => {
  describe('translates from translations set', () => {
    it('translate a singular string', () => {
      expect(
        getTranslation(translationData, 'da', null, 'hello', null, null, {})
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
        {}
      )
      const replaced = replaceString(output, { n: 3 })
      expect(replaced).toMatch('3 dage')
    })

    it('translates with fallback country code', () => {
      expect(
        getTranslation(translationData, 'en', null, 'bye', null, null, {})
      ).toMatch('bye')
      expect(
        getTranslation(translationData, 'da', null, 'bye', null, null, {})
      ).toMatch('farvel')
      expect(
        getTranslation(translationData, 'da_DK', null, 'bye', null, null, {})
      ).toMatch('farvel')
      expect(
        getTranslation(translationData, 'da_GL', null, 'bye', null, null, {})
      ).toMatch('farvel')
      expect(
        getTranslation(translationData, 'fr_FR', null, 'hello', null, null, {})
      ).toMatch('bonjour')
      expect(
        getTranslation(translationData, 'fr_XX', null, 'bye', null, null, {})
      ).toMatch('au revoir')
      expect(
        getTranslation(translationData, 'fr', null, 'bye', null, null, {})
      ).toMatch('au revoir')
      expect(
        getTranslation(translationData, 'de', null, 'bye', null, null, {})
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
        getTranslation(set, 'test', null, 'a fish', null, null, {})
      ).toMatch('un poisson')
      expect(
        getTranslation(
          set,
          'test_underscore',
          null,
          'a goldfish',
          null,
          null,
          {}
        )
      ).toMatch('un poisson rouge')
      expect(
        getTranslation(set, 'test-hyphen', null, 'a shark', null, null, {})
      ).toMatch('un requin')
      expect(
        getTranslation(set, 'test_undefined', null, 'test', null, null, {})
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
  })

  describe('fails on missing plural data', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {})
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
        { verbose: true }
      )
      expect(logSpy).toHaveBeenCalledWith(
        'translations are missing Plural-Forms setting'
      )
    })
  })
})
