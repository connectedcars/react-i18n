import { AnyAction } from 'redux'
import { SET_LANGUAGE } from './constants'

export interface I18nState {
  lang: string
}

const initialState: I18nState = {
  lang: 'en'
}

export const i18nReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return { ...state, lang: action.lang }

    default:
      return state
  }
}
