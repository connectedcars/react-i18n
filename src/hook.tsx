import { useContext } from 'react'

import { I18nContext } from './context'

const useTranslate = () => useContext(I18nContext)

export { useTranslate }
