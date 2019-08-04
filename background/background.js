
import { Lang } from '../languages.js';
// // var newTranslation = `https://www.wordreference.com/es/translation.asp?tranword=${message.search}`
var imagesURL = (search) => `https://www.google.com/search?q=${search}&source=lnms&tbm=isch`;
var translationURL = (search) => `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${search}`;
var tabIdTranslation = null;
var tabIdImageSearch = null;
var storedDataUrl = null;
var storedDataTabId = null;
var studyElementsURL = null;
var studyElementsTabId = null;
var HGLTAvailable = false;
var HGLTSiteAvailable = false;

const createSearchTabs = (search, createImageTab = true, createTranslationTab = true) => {

    if (HGLTAvailable) {
        if (createImageTab) {
            chrome.tabs.create({
                "url": imagesURL(search),
                "pinned": true,
                "selected": false
            }, (imageSearchTab) => {
                tabIdImageSearch = imageSearchTab.id;
            });
        }
        if (createTranslationTab) {
            chrome.tabs.create({
                "url": translationURL(search),
                "pinned": true,
                "selected": false
            }, (translationTab) => {
                tabIdTranslation = translationTab.id;
            });
        }
    }


}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'background' && message.action === 'SEND_INFORMATION') {

        message.target = 'main-content';
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, message);
            });
        });

    }

    if (message.target === 'background' && message.action === 'ASK_TRANSLATION_AND_IMAGES') {


        chrome.tabs.query({ pinned: true }, (tabs) => {

            let translationTabOpen = false;
            let imageTabOpen = false;

            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i].url.includes("https://www.google.com/search")) {

                    imageTabOpen = true;
                    chrome.tabs.sendMessage(tabs[i].id, {
                        target: 'images',
                        action: 'ASK_IMAGES',
                        selection: message.selection
                    });

                }
                if (tabs[i].url.includes("https://translate.google.com/")) {

                    translationTabOpen = true;
                    chrome.tabs.sendMessage(tabs[i].id, {
                        target: 'translation',
                        action: 'ASK_TRANSLATION',
                        selection: message.selection,
                        from: message.settings.translation.fromLang,
                        to: message.settings.translation.toLang
                    });

                }
            }

            if (!translationTabOpen) {
                chrome.tabs.create({
                    "url": translationURL(message.selection),
                    "pinned": true,
                    "selected": false
                }, (translationTab) => {
                    chrome.tabs.sendMessage(translationTab.id, {
                        target: 'translation',
                        action: 'ASK_TRANSLATION',
                        selection: message.selection,
                        from: message.settings.translation.fromLang,
                        to: message.settings.translation.toLang
                    });
                });
            }

            if (!imageTabOpen) {
                chrome.tabs.create({
                    "url": imagesURL(message.selection),
                    "pinned": true,
                    "selected": false
                }, (imageSearchTab) => {
                    chrome.tabs.sendMessage(imageSearchTab.id, {
                        target: 'images',
                        action: 'ASK_IMAGES',
                        selection: message.selection
                    });
                });
            }

        });

    }

    if (message.target === 'background' && message.action === 'ASK_LARGER_IMAGE_LINK') {
        message.target = 'images';

        chrome.tabs.query({ active:true }, (tabs) => {
        
            const activeTabId = tabs[0].id; 
            
            chrome.tabs.query({ pinned: true }, (tabs) => {
                tabs.forEach(tab => {
                    if (tab.url.includes("https://www.google.com/search")) {
    
                        chrome.tabs.sendMessage(tab.id, message, (response) => {
                            sendResponse(response);
                        });
    
                        chrome.tabs.update(tab.id, {selected: true});
                        setTimeout(()=>{
                            chrome.tabs.update(activeTabId, {selected: true});
                        },1000)
    
                    }
                });
    
            });        
        
        });

    }

    if (message.target === 'background' && message.action === 'SEE_STORED_DATA') {

        if (!storedDataUrl) {
            storedDataUrl = chrome.runtime.getURL("store/stored_data.html");
            chrome.tabs.create({ url: storedDataUrl }, (tab) => {
                storedDataTabId = tab.id;
            });
        } else {
            chrome.tabs.query({}, (tabs) => {

                var isAvailable = false;

                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].id === storedDataTabId) {
                        chrome.tabs.reload(storedDataTabId);
                        chrome.tabs.update(storedDataTabId, { active: true });
                        isAvailable = true;
                        break;
                    }
                }

                if (!isAvailable) {
                    storedDataUrl = chrome.runtime.getURL("store/stored_data.html");
                    chrome.tabs.create({ url: storedDataUrl }, (tab) => {
                        storedDataTabId = tab.id;
                    });
                }

            });


        }


    }

    if (message.target === 'background' && message.action === 'STUDY_ELEMENTS') {

        if (!studyElementsURL) {
            studyElementsURL = chrome.runtime.getURL("store/study_elements.html");
            chrome.tabs.create({ url: studyElementsURL }, (tab) => {
                studyElementsTabId = tab.id;
            });
        } else {

            chrome.tabs.query({}, (tabs) => {

                var isAvailable = false;

                for (let i = 0; i < tabs.length; i++) {
                    if (tabs[i].id === studyElementsTabId) {
                        chrome.tabs.reload(studyElementsTabId);
                        chrome.tabs.update(studyElementsTabId, { active: true });
                        isAvailable = true;
                        break;
                    }
                }

                if (!isAvailable) {
                    studyElementsURL = chrome.runtime.getURL("store/study_elements.html");
                    chrome.tabs.create({ url: studyElementsURL }, (tab) => {
                        studyElementsTabId = tab.id;
                    });
                }

            });


        }

    }

    return true;
});


chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltAvailible') {
            if (!changes[key].newValue) {
                if (tabIdTranslation) chrome.tabs.remove(tabIdTranslation);
                if (tabIdImageSearch) chrome.tabs.remove(tabIdImageSearch);
            } else {
                chrome.tabs.query({ pinned: true }, (tabs) => {
                    tabs.forEach(tab => {
                        if (tab.url.includes("https://www.google.com/search")) {
                            chrome.tabs.remove(tab.id);
                        }
                        if (tab.url.includes("https://translate.google.com/")) {
                            chrome.tabs.remove(tab.id);
                        }
                    });
                    createSearchTabs("example");
                });
            }

        }
    }

});


chrome.tabs.query({ pinned: true }, (tabs) => {

    tabs.forEach(tab => {
        if (tab.url.includes("https://www.google.com/search")) {
            chrome.tabs.remove(tab.id);
        }
        if (tab.url.includes("https://translate.google.com/")) {
            chrome.tabs.remove(tab.id);
        }
    });
    createSearchTabs("example");
});


chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "marker") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const message = {};
            message.target = 'content-marker';
            message.action = 'ADD_MARKER';
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }
});

const createContextMenu = () => {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "marker",
            title: Lang[navigator.language.split("-")[0]].marker.add_a_marker_here,
            contexts: ["all"]
        });
    });
}

const removeContextMenu = () => {
    // chrome.contextMenus.remove("marker");
    chrome.contextMenus.removeAll(() => { });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltAvailible') {
            HGLTAvailable = changes[key].newValue;
            (HGLTAvailable) ? createContextMenu() : removeContextMenu();
        }
    }

});

chrome.storage.sync.get({ 'hgltAvailible': false }, (result) => {
    HGLTAvailable = result.hgltAvailible;
    (HGLTAvailable) ? createContextMenu() : removeContextMenu();
});