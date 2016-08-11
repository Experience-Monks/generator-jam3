function loadScript(name, tabId, cb) {
  manageNotify();
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3000/${name}.bundle.js`)
    .then(res => res.text())
    .then(fetchRes => {
      const request = new XMLHttpRequest();
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
    });
  }
}

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return;
  if (chrome.runtime.lastError) return;
});

chrome.tabs.onActivated.addListener( (tab) => {
  if(loadedTabs.indexOf(tab.tabId) === -1) {
    loadedTabs.push(tab.tabId);
    chrome.tabs.executeScript(tab.tabId, {
      file: 'content_script.js',
      runAt: 'document_end'
    });
  }
});
