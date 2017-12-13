import { SET_LANGUAGE } from './constants'

export const setLanguage = (lang: string) =>({
  type: SET_LANGUAGE, lang
})
