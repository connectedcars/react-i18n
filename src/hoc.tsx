import React from 'react'
import { I18nContext, I18nContextProps } from './context'
import { Omit } from './types'

export interface WithTranslateProps extends I18nContextProps {}

function withTranslate<P extends WithTranslateProps>(
  BaseComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof WithTranslateProps>> {
  return class WithTranslate extends React.Component<P> {
    static displayName = `withTranslate(${BaseComponent.displayName})`

    static contextType = I18nContext

    render() {
      return <BaseComponent {...this.props} {...this.context} />
    }
  }
}

export { withTranslate }
