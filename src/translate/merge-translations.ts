import { Translations } from "../types"

export const mergeTranslations = (translations: Translations[]): Translations => {
  const mergedTranslations: Translations = {}

  for (const t of translations) {
    for (const key of Object.keys(t)) {
      const value = t[key]
      if (mergedTranslations[key]) {
        // This is a naive implementation. This overrides translations in previous sets, so the last one will always be the one picked.
        // Even if something is translated in one translation file, but isn't in the last file, they will still be replaced.
        mergedTranslations[key] = {
          ...mergedTranslations[key],
          ...value
        }
      } else {
        mergedTranslations[key] = value
      }
    }
  }

  return mergedTranslations
}
