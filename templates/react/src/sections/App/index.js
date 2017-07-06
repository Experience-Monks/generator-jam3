import { connect } from 'react-redux';
import App from './App';
import { setWindowSize } from '../../store/actions/app';

const mapStateToProps = (state, ownProps) => {
  let section = ownProps.location.pathname.split('/').filter(Boolean)[0] || 'landing';

  return {
    section: section,
    ready: state.ready,
    windowWidth: state.windowSize.width,
    windowHeight: state.windowSize.height,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setWindowSize: val => dispatch(setWindowSize(val)),
  };
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {withRef: true}
)

export default class AppWrapper extends App {
  constructor(props) {
    super(props);
    this.displayName = 'AppWrapper';
  }
}
