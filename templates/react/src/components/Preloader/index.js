import { connect } from 'react-redux';
import connectTransitionWrapper from '../../decorators/connectTransitionWrapper';

import Preloader from './Preloader';
import { setReady } from '../../store/actions/app';
import { setProgress, setAssets } from '../../store/actions/preloader';

const mapStateToProps = (state, ownProps) => {
  return {
    progress: state.preloader.progress,
    assets: state.preloader.assets,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAssets: val => dispatch(setAssets(val)),
    setProgress: val => dispatch(setProgress(val)),
    setReady: val => dispatch(setReady(val)),
  };
};

@connectTransitionWrapper()
@connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {withRef: true}
)

export default class extends Preloader {
  constructor(props) {
    super(props);
    this.displayName = 'Preloader';
  }
}

