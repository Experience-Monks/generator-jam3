module.exports = function() {
  if (window._browserWarning) {
    let dom = document.createElement('div');
    let remove = function(dom) {
      dom.style.opacity = 0;
      setTimeout(function() {
        if (dom.parentNode) dom.parentNode.removeChild(dom);
      },500);
    }.bind(this,dom);
    dom.className = 'browser-warning';
    dom.addEventListener('click', remove);
    dom.innerHTML = 'This site has not been optimized for your browser, please upgrade to the latest version.<div class="close">&#10006;</div>';
    setTimeout(remove, 5000);
    document.body.appendChild(dom);
  }
}
