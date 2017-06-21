/**
 * This component is based on 'Preloader' npm module
 * Refer https://www.npmjs.com/package/preloader for more information
 */

'use strict';

import React from 'react';
import animate from 'gsap';
import preloader from 'preloader';
import SVGInline from 'react-svg-inline';
import LoaderIcon from '../../../raw-assets/svg/loader.svg';

class Preloader extends React.Component {
  constructor(props) {
    super(props);
    this.onProgress = this.onProgress.bind(this);
    this.setDone = this.setDone.bind(this);
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

  animateIn(done) {
    animate.to(this.container, 0.5, {autoAlpha: 1, onComplete: done});
  };

  animateOut(done) {
    animate.to(this.container, 0.5, {autoAlpha: 0, onComplete: done});
  };

  setTimer() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, this.props.minDisplayTime)
    })
  };

  setLoader() {
    return new Promise((resolve, reject) => {
      this.loader = preloader(this.props.options);
      this.props.assetsList.forEach(file => this.add(file));
      this.loader.on('progress', this.onProgress);
      this.loader.on('complete', () => this.onComplete(resolve));
      this.load();
    })
  };

  /**
   * Generic asset loader function - determines loader to be used based on file-extension
   * @param url (String) - URL of asset
   * @param options (Object) - Custom options to override the global options created at instantiation
   */
  add(url, options = {}) {
    this.loader.add(url, options);
  };

  /**
   * Retrieve loaded asset from loader
   * @param url (String) - URL of asset
   * @returns {*} - Asset instance
   */
  get(url) {
    return this.loader.get(url);
  };

  /**
   * Begin loading process
   */
  load() {
    this.loader.load();
  };

  /**
   * Stop loading process
   */
  stopLoad() {
    this.loader.stopLoad();
  };

  onProgress(val) {
    this.props.setProgress(val);
    //console.log('Preloader progress:', val);
  };

  onComplete(done) {
    this.props.setProgress(1);
    done();
    //console.log('Preloader: assets are loaded');
  };

  setDone() {
    this.props.setReady(true);
  };

  render() {
    const style = Object.assign({}, this.props.style);

    return (
      <div
        id="preloader"
        style={style}
        ref={r => this.container = r}
      >
        <div className="loader-icon">
          <SVGInline svg={LoaderIcon}/>
        </div>
      </div>
    );
  }
}

Preloader.propTypes = {
  assetsList: React.PropTypes.array.isRequired,
  setProgress: React.PropTypes.func,
  setReady: React.PropTypes.func.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  style: React.PropTypes.object,
  minDisplayTime: React.PropTypes.number,
  options: React.PropTypes.object,
};

Preloader.defaultProps = {
  setProgress: f => f,
  style: {},
  minDisplayTime: 0, // in milliseconds
  options: {
    xhrImages: false,
    loadFullAudio: false,
    loadFullVideo: false,
    onProgress: f => f,
    onComplete: f => f,
  },
};

export default Preloader;
