import { AnyAction } from 'redux'
import { SET_LANGUAGE } from './constants'

const initialState = {
  lang: 'en'
}

export const I18NReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return { ...state, lang: action.lang }

    default:
        return state
  }
}
