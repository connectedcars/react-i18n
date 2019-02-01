import { withTranslate } from '@connectedcars/react-i18n'
import React from 'react'
import './index.css'

const ToggleLocale = withTranslate(({ tx, setLocale, locale }) => {
  const swapLocale = locale === 'da' ? 'en' : 'da'
  return (
    <button onClick={() => setLocale(swapLocale)}>
      {tx('Set language to <lang />', {
        lang: (content, attr) => <strong>{swapLocale}</strong>,
      })}
    </button>
  )
})

export default ToggleLocale
