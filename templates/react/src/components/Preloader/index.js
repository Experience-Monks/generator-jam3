/**
 * This component is based on 'Preloader' npm module
 * Refer https://www.npmjs.com/package/preloader for more information
 */

'use strict';

import React from 'react';
import ReactF1 from 'react-f1';
import states from './states';
import transitions from './transitions';
import preloader from 'preloader';
import SVGInline from 'react-svg-inline';
import LoaderIcon from '../../../raw-assets/svg/loader.svg';

class Preloader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'out'
    };
  }

  componentWillMount() {
    this.props.setAssets([...this.props.assetsList]);
  }

  componentDidMount() {
    Promise.all([
      this.setTimer(),
      this.setLoader(),
    ]).then(this.setDone)
  }

  componentWillAppear(done) {
    this.animateIn(done);
  }

  componentWillEnter(done) {
    this.animateIn(done);
  }

  componentWillLeave(done) {
    this.animateOut(done);
  }

  animateIn = (done) => {
    this.setState({
      state: 'idle',
      onComplete: done
    });
  };

  animateOut = (done) => {
    this.setState({
      state: 'out',
      onComplete: done
    })
  };

  setTimer = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
        //console.log('Preloader: min time is up')
      }, this.props.minDisplayTime)
    })
  };

  setLoader = () => {
    return new Promise((resolve, reject) => {
      this.loader = preloader(this.props.options);
      this.props.assetsList.forEach(file => this.add(file));
      this.loader.on('progress', this.onLoadingProgress);
      this.loader.on('complete', () => this.onLoadingComplete(resolve));
      this.load();
    })
  };

  /**
   * Generic asset loader function - determines loader to be used based on file-extension
   * @param url (String) - URL of asset
   * @param options (Object) - Custom options to override the global options created at instantiation
   */
  add = (url, options = {}) => {
    this.loader.add(url, options);
  };

  /**
   * Retrieve loaded asset from loader
   * @param url (String) - URL of asset
   * @returns {*} - Asset instance
   */
  get = (url) => {
    return this.loader.get(url);
  };

  /**
   * Begin loading process
   */
  load = () => {
    this.loader.load();
  };

  /**
   * Stop loading process
   */
  stopLoad = () => {
    this.loader.stopLoad();
  };

  onLoadingProgress = (val) => {
    this.props.setProgress(val);
    //console.log('Preloader progress:', val);
  };

  onLoadingComplete = (done) => {
    this.props.setProgress(1);
    done();
    //console.log('Preloader: assets are loaded');
  };

  setDone = () => {
    this.props.setReady(true);
  };

  render() {
    const style = Object.assign({}, this.props.style);

    return (
      <ReactF1
        id="preloader"
        data-f1="container"
        style={style}
        go={this.state.state}
        onComplete={this.state.onComplete}
        states={states(this.props)}
        transitions={transitions(this.props)}
      >
        <div className="loader-icon">
          <SVGInline svg={LoaderIcon}/>
        </div>
      </ReactF1>
    );
  }
}

Preloader.propTypes = {
  assetsList: React.PropTypes.array.isRequired,
  setProgress: React.PropTypes.func,
  setReady: React.PropTypes.func.isRequired,
  setAssets: React.PropTypes.func,
  windowWidth: React.PropTypes.number,
  windowHeight: React.PropTypes.number,
  style: React.PropTypes.object,
  minDisplayTime: React.PropTypes.number,
  options: React.PropTypes.object,
};

Preloader.defaultProps = {
  setProgress: f => f,
  setAssets: f => f,
  style: {},
  minDisplayTime: 1500, // in milliseconds
  options: {
    xhrImages: false,
    loadFullAudio: false,
    loadFullVideo: false,
    onProgress: f => f,
    onComplete: f => f,
  },
};

export default Preloader;