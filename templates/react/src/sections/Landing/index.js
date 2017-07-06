import { connect } from 'react-redux';
import connectTransitionWrapper from '../../decorators/connectTransitionWrapper';
import Landing from './Landing';

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

@connectTransitionWrapper()
@connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {withRef: true}
)

export default class LandingWrapper extends Landing {
  constructor(props) {
    super(props);
    this.displayName = 'LandingWrapper';
  }
}
