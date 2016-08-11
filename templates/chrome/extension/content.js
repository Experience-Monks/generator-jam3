import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../build/bundle.js';
import './content.css';

var WIDTH = 450;
var HEIGHT = 254;

chrome.storage.local.get('state', obj => {
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');

  const createStore = require('../../app/store/configureStore');
  require('domready')(function() {
    ReactDOM.render(
      <Root store={createStore(initialState)} />,
      document.querySelector('#root'),
      onRendered
    );
  });
});

function onRendered() {  
  setTimeout(() => {
    document.body.style.width = WIDTH + 'px';
    document.body.style.height = HEIGHT + 'px';
  },300);
}
