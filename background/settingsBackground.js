import { Lang } from '../languages.js';

chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltAvailible') {
            chrome.storage.sync.get({ 'hgltSettings': false }, (resultHighliter) => {
                setIcon(changes[key].newValue, resultHighliter.hgltSettings.markStoredElements);
            });
        }

        if (key === 'hgltSettings') {
            chrome.storage.sync.get({ 'hgltAvailible': false }, (resultAvailable) => {
                setIcon(resultAvailable.hgltAvailible, changes[key].newValue.markStoredElements);
            });
        }
    }

});

chrome.storage.sync.get({ 'hgltAvailible': false }, (resultAvailable) => {
    chrome.storage.sync.get({ 'hgltSettings': false }, (resultHighliter) => {
        setIcon(resultAvailable.hgltAvailible, resultHighliter.hgltSettings.markStoredElements);
    });
});

chrome.tabs.onActivated.addListener(function (tab) {
    setBadge();
});

chrome.tabs.onUpdated.addListener(function (tab) {
    setBadge();
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

const setBadge = () => {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {

        chrome.storage.sync.get({ 'hgltSitesNotAvailables': [] }, (resultSiteAvailable) => {

            const url = tab[0].url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
            let state = false;
            let currentDomain = tab[0].url;
            if (url) {
                currentDomain = (url[1]);
                state = !resultSiteAvailable.hgltSitesNotAvailables.includes(currentDomain);
            }

            chrome.browserAction.setBadgeText({ text: (state) ? "" : "off" });
        });


    })
}  

const setIcon = (active, highlighter = false) => {
    if (active && !highlighter) {
        chrome.browserAction.setIcon({
            path: chrome.runtime.getURL('images/active.svg')
        });
    }
    else if(active && highlighter){
        chrome.browserAction.setIcon({
            path: chrome.runtime.getURL('images/active_highlighting.svg')
        });
    } 
    else {
        chrome.browserAction.setIcon({
            path: chrome.runtime.getURL('images/inactive.svg')
        });
    }

}
