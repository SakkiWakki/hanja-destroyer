chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ mode: 3 });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'changeMode') {
    chrome.storage.sync.set({ mode: message.mode });
  }
});
