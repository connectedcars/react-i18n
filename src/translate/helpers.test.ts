import {
  formatLocale,
  getSupportedLocaleFromLocalesList,
  parseLocale,
} from './helpers'

describe('helpers', () => {
  describe('parseLocale', () => {
    it('translate a singular string', () => {
      expect(parseLocale('da')).toEqual({
        languageCode: 'da',
        countryCode: null,
      })
      expect(parseLocale('da_DK')).toEqual({
        languageCode: 'da',
        countryCode: 'DK',
      })
      expect(parseLocale('da_dk')).toEqual({
        languageCode: 'da',
        countryCode: 'DK',
      })
      expect(parseLocale('da-dk')).toEqual({
        languageCode: 'da',
        countryCode: 'DK',
      })
    })
  })

  describe('formatLocale', () => {
    it('formats locales properly', () => {
      expect(formatLocale('da', 'xx-yy')).toBe('da')
      expect(formatLocale('da_DK', 'xx_YY')).toBe('da_DK')
      expect(formatLocale('da_DK', 'xx_yy')).toBe('da_dk')
      expect(formatLocale('da_DK', 'xx-yy')).toBe('da-dk')
      expect(formatLocale('da_DK', 'xx-YY')).toBe('da-DK')
    })
  })

  describe('getSupportedLocaleFromLocalesList', () => {
    it('returns the correct matching locale with fallback', () => {
      expect(getSupportedLocaleFromLocalesList(['da'], ['da', 'en'])).toBe('da')
      expect(getSupportedLocaleFromLocalesList(['da_DK'], ['da', 'en'])).toBe(
        'da'
      )
      expect(
        getSupportedLocaleFromLocalesList(['da_GL'], ['da_DK', 'en'])
      ).toBe('da_DK')
      expect(
        getSupportedLocaleFromLocalesList(['da_GL'], ['da_DK', 'da', 'en'])
      ).toBe('da_DK')
      expect(
        getSupportedLocaleFromLocalesList(
          ['da_GL', 'da_DK'],
          ['da_DK', 'da', 'en']
        )
      ).toBe('da_DK')
      expect(
        getSupportedLocaleFromLocalesList(
          ['da_GL', 'da_DK'],
          ['da', 'da_DK', 'en']
        )
      ).toBe('da_DK')
      expect(getSupportedLocaleFromLocalesList(['fr_FR'], ['da', 'en'])).toBe(
        null
      )
      expect(
        getSupportedLocaleFromLocalesList(
          ['fr', 'en_GB'],
          ['da_DK', 'da', 'en']
        )
      ).toBe('en')
    })
  })
})
