console.log('serviceWorker script loaded');

//Open  window for app
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
    chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        type: "popup"
    });

    
});
