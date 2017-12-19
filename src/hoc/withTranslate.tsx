import React, { createElement, Component, ComponentType } from 'react'
import * as PropTypes from 'prop-types'

export const withTranslate = (WrappedComponent: ComponentType) => {
  return class WithTranslate extends Component {
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
