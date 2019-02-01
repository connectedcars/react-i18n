import React from 'react'
import { I18nContext, I18nContextProps } from './context'

function withTranslate<T = {}>(
  BaseComponent: React.ComponentType<T & I18nContextProps>
): React.ComponentType<T> {
  return class WithTranslate extends React.Component<T> {
    static displayName = `withTranslate(${BaseComponent.displayName})`

    static contextType = I18nContext

    render() {
      return <BaseComponent {...this.props} {...this.context} />
    }
  }
}

export { withTranslate }
