import { Lang } from '../languages.js';

chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltAvailible') {
            setIcon(changes[key].newValue);
        }
    }

});

chrome.storage.sync.get({ 'hgltAvailible': false }, (result) => {
    setIcon(result.hgltAvailible);
});

const setIcon = (active) => {
    if (active) {
        chrome.browserAction.setIcon({
            path: chrome.runtime.getURL('images/pencil_active_64.png')
        });
    } else {
        chrome.browserAction.setIcon({
            path: chrome.runtime.getURL('images/pencil_64.png')            
        });
    }

}

chrome.tabs.onActivated.addListener(function(tab) {
   
    chrome.tabs.query({active: true, currentWindow: true}, function(tab) {

        chrome.storage.sync.get({ 'hgltSitesNotAvailables': [] }, (resultSiteAvailable) => {                    
            
            const url = tab[0].url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
                    let state = false;
                    let currentDomain = tab[0].url;
                    if (url) {
                        currentDomain = (url[1]);
                        state = !resultSiteAvailable.hgltSitesNotAvailables.includes(currentDomain);
                    } 
    
                    chrome.browserAction.setBadgeText({text: (state)?"":"off"});
        });
   
                
     })
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'settings-background' && message.action === 'ASK_LANG') {
        sendResponse(Lang);
    }

});


chrome.runtime.onInstalled.addListener(details => { 
    chrome.storage.sync.get({ 'hgltSitesNotAvailables': [] }, (result) => {        
        chrome.storage.sync.set({ hgltSitesNotAvailables: ['translate.google.com'] });
    });   
  });
