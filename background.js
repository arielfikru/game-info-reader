chrome.runtime.onInstalled.addListener(() => {
    console.log('Game8 Cleaner extension installed');
    
    // Set default values for extension settings
    chrome.storage.sync.set({
      videoAllowed: true,
      adRemoval: true
    }, () => {
      console.log('Default settings initialized');
    });
  });
  
  // Listen for messages from content scripts or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSettings") {
      chrome.storage.sync.get(['videoAllowed', 'adRemoval'], (data) => {
        sendResponse(data);
      });
      return true; // Indicates that the response is asynchronous
    }
  });