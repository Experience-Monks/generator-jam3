/*
 Example of UI component connected with the Store
 */

import React from 'react';
import { connect } from 'react-redux';
import TransitionGroup from 'react-transition-group-plus';
import Preloader from '../../components/Preloader{{#if sectionNames}}/Preloader{{/if}}';
import { setReady, setProgress } from '../../sections/App/actions';

class Test extends React.Component {
  componentWillUnmount() {
    this.props.setProgress(0);
    this.props.setReady(false);
  }

  render() {
    return (
      <TransitionGroup>
        {
          !this.props.ready &&
          <Preloader
            {...this.props}
            assetsList={this.props.assets}
            setProgress={this.props.setProgress}
            setReady={this.props.setReady}
          />
        }
      </TransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  assets: state.assets,
  ready: state.ready
});

const mapDispatchToProps = dispatch => ({
  setProgress: val => dispatch(setProgress(val)),
  setReady: val => dispatch(setReady(val))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Test);
