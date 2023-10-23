import { FormatLocaleOption } from '../types'

export const parseLocale = (locale: string) => {
  const [languageCode, countryCode] = locale.split(/[-_]/)
  return {
    languageCode,
    countryCode: countryCode?.toUpperCase() || null,
  }
}

export const formatLocale = (locale: string, format: FormatLocaleOption) => {
  const { languageCode, countryCode } = parseLocale(locale)
  if (!countryCode) {
    return languageCode.toLowerCase()
  }
  return format
    .replace('xx', languageCode.toLowerCase())
    .replace('XX', languageCode.toUpperCase())
    .replace('yy', countryCode.toLowerCase())
    .replace('YY', countryCode.toUpperCase())
}

export const getSupportedLocaleFromLocalesList = (
  clientLocales: readonly string[],
  translationLocales: string[],
  format: FormatLocaleOption = 'xx_YY'
): string | null => {
  const locales = clientLocales.map((v) => {
    return formatLocale(v, format)
  })

  // Filter all matching languages on the first part of the locale.
  const supported = translationLocales
    .filter((l1) => {
      const [userLocale] = l1.split(/[-_]/)
      return locales.find((l2) => {
        const [locale] = l2.split(/[-_]/)
        return locale.toLowerCase() === userLocale.toLowerCase()
      })
    })
    .map((v) => formatLocale(v, format))

  // Attempt to find direct matches first
  for (const l of locales) {
    if (supported.includes(l)) {
      return l
    }
  }

  // If we can't find a direct match, try matching the first part of the locale.
  for (const l of locales) {
    const found = supported.find(
      (x) => x.split(/[-_]/)[0] === l.split(/[-_]/)[0]
    )
    if (found) {
      return found
    }
  }

  return null
}
