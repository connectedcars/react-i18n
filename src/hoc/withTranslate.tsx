import React, { createElement, Component, ComponentType } from 'react'
import * as PropTypes from 'prop-types'

export interface WithTranslateProps {
  t(text: string, data?: Object, context?: string): string
  tn(n: number, text: string, textPlural: string, data?: Object, context?: string | null): string
}

export function withTranslate<T>(WrappedComponent: ComponentType<T>) {
  return class WithTranslate extends Component<T> {
    static contextTypes = {
      t: PropTypes.func.isRequired,
      tn: PropTypes.func.isRequired
    }

    addExtraProps(props: any) {
      return {
        ...props,
        t: this.context.t,
        tn: this.context.tn
      }
    }

    render() {
      return createElement(WrappedComponent, this.addExtraProps(this.props))
    }
  }
}
