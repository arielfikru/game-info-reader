document.addEventListener('DOMContentLoaded', function() {
    const videoToggle = document.getElementById('videoToggle');
    const adToggle = document.getElementById('adToggle');
    const cleanButton = document.getElementById('cleanButton');

    // Load saved states
    chrome.runtime.sendMessage({action: "getSettings"}, (response) => {
        videoToggle.checked = response.videoAllowed;
        adToggle.checked = response.adRemoval;
    });

    videoToggle.addEventListener('change', function() {
        const videoAllowed = videoToggle.checked;
        chrome.storage.sync.set({videoAllowed: videoAllowed});
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "toggleVideo", allowed: videoAllowed});
        });
    });

    adToggle.addEventListener('change', function() {
        const adRemoval = adToggle.checked;
        chrome.storage.sync.set({adRemoval: adRemoval});
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "toggleAdRemoval", enabled: adRemoval});
        });
    });

    cleanButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "cleanPage"});
        });
    });
});