'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import animate from 'gsap';
import preloader from 'preloader';
import SVGInline from 'react-svg-inline';
import LoaderIcon from '../../../raw-assets/svg/loader.svg';

class Preloader extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    animate.set(this.container, {autoAlpha: 0});

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

  animateIn(onComplete) {
    animate.to(this.container, 0.5, {autoAlpha: 1, onComplete});
  };

  animateOut(onComplete) {
    animate.to(this.container, 0.5, {autoAlpha: 0, onComplete});
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
      this.props.assets.forEach(file => this.add(file));
      this.loader.on('progress', this.onProgress);
      this.loader.on('complete', () => this.onComplete(resolve));
      this.load();
    })
  };

  add(url, options = {}) {
    this.loader.add(url, options);
  };

  get(url) {
    return this.loader.get(url);
  };

  load() {
    this.loader.load();
  };

  stopLoad() {
    this.loader.stopLoad();
  };

  onProgress = (val) => {
    this.props.setProgress(val);
  };

  onComplete = (done) => {
    this.props.setProgress(1);
    done();
  };

  setDone = () => {
    this.props.setReady(true);
  };

  render() {
    const props = this.props;
    const style = Object.assign({}, props.style);

    return (
      <section
        id="Preloader"
        style={style}
        ref={r => this.container = r}
      >
        <SVGInline
          className="loader-icon"
          svg={LoaderIcon}
          component="div"
        />
      </section>
    );
  }
}

Preloader.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  assets: PropTypes.array.isRequired,
  setProgress: PropTypes.func.isRequired,
  setReady: PropTypes.func.isRequired,
  minDisplayTime: PropTypes.number,
  options: PropTypes.object,
  isTest: PropTypes.bool,
};

Preloader.defaultProps = {
  className: '',
  style: {},
  minDisplayTime: 0, // in milliseconds
  options: {
    xhrImages: false,
    loadFullAudio: false,
    loadFullVideo: false,
    onProgress: f => f,
    onComplete: f => f,
  },
  setProgress: f => f,
};

export default Preloader;
