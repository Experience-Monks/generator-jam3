const noop = f => f;

export default function(el, onEnter = noop, onExit = noop) {
  const detectFullScreen = () => {
    return (
      document.fullScreen ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      (document.msFullscreenElement !== undefined && document.msFullscreenElement !== null)
    );
  };

  let onFullScreenChange = () => {
    let isFullScreen = detectFullScreen();
    if (!isFullScreen) {
      onExit();
    } else {
      onEnter();
    }
  };
  document.addEventListener('fullscreenchange', onFullScreenChange);
  document.addEventListener('mozfullscreenchange', onFullScreenChange);
  document.addEventListener('webkitfullscreenchange', onFullScreenChange);
  document.addEventListener('MSFullscreenChange', onFullScreenChange);

  function destroy() {
    document.removeEventListener('fullscreenchange', onFullScreenChange);
    document.removeEventListener('mozfullscreenchange', onFullScreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
    document.removeEventListener('MSFullscreenChange', onFullScreenChange);
  }

  return {
    enter() {
      let requestFullScreen = (
        el.requestFullScreen ||
        el.mozRequestFullScreen ||
        el.webkitRequestFullScreen ||
        el.msRequestFullscreen
      );
      requestFullScreen && requestFullScreen.call(el);
    },
    exit() {
      let exitFullScreen = (
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen
      );
      exitFullScreen && exitFullScreen.call(document);
    },
    isFullScreen: detectFullScreen,
    destroy,
  };
}
