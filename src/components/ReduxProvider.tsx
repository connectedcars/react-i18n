import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Provider } from './Provider'
import { setLanguage } from '../redux/actions'

const mapStateToProps = (state: any) => ({
  lang: state.i18n.lang
})

const mapDispatchToProps = (dispatch: Dispatch<{}>) => ({
  setLanguage: (lang: string) => dispatch(setLanguage(lang))
})

export const ReduxProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(Provider)
