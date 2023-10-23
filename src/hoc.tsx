import React from 'react'

import { I18nConsumer } from './consumer'
import { I18nContextProps } from './context'

export interface WithTranslateProps extends I18nContextProps {}

function withTranslate<P extends object>(
  BaseComponent: React.ComponentType<P & WithTranslateProps>
): React.ComponentType<Omit<P, keyof WithTranslateProps>> {
  const displayName =
    BaseComponent.displayName || BaseComponent.name || 'Component'

  return class WithTranslate extends React.Component<P> {
    static displayName = `withTranslate(${displayName})`

    render() {
      return (
        <I18nConsumer>
          {(i18nProps) => <BaseComponent {...i18nProps} {...this.props} />}
        </I18nConsumer>
      )
    }
  }
}

export { withTranslate }
