import React, { createElement, Component, ComponentType } from 'react'
import * as PropTypes from 'prop-types'
import { TranslateFunc, TranslatePluralFunc } from '../types'

export interface WithTranslateProps {
  t: TranslateFunc
  tn: TranslatePluralFunc
}

export function withTranslate<T>(WrappedComponent: ComponentType<T & WithTranslateProps>) {
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
