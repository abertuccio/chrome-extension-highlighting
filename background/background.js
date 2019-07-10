
// // var newTranslation = `https://www.wordreference.com/es/translation.asp?tranword=${message.search}`

var tabIdTranslation = null;
var tabIdImageSearch = null;

const createSearchTabs = (search) => {

    const newSearch = `https://www.google.com/search?q=${search}&source=lnms&tbm=isch`;
    const newTranslation = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${search}`

    chrome.tabs.create({
        "url": newSearch,
        "pinned": true,
        "selected": false
    }, (imageSearchTab) => {
        tabIdImageSearch = imageSearchTab.id;
    });
    chrome.tabs.create({
        "url": newTranslation,
        "pinned": true,
        "selected": false
    }, (translationTab) => {
        tabIdTranslation = translationTab.id;
    });

}

// chrome.runtime.onInstalled.addListener(function (details) {

//     chrome.tabs.query({ pinned: true }, (tabs) => {

//         tabs.forEach(tab => {
//             if (tab.url.includes("https://www.google.com/search")) {
//                 chrome.tabs.remove(tab.id);
//             }
//             if (tab.url.includes("https://translate.google.com/")) {
//                 chrome.tabs.remove(tab.id);
//             }
//         });
//             createSearchTabs("example");
//     });


// });


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

        if (tabIdTranslation && tabIdImageSearch) {

            chrome.tabs.sendMessage(tabIdTranslation, {
                target: 'translation',
                action: 'ASK_TRANSLATION',
                selection: message.selection,
                from: message.settings.translation.fromLang,
                to: message.settings.translation.toLang
            });

            // if(message.settings.images.availible){
            chrome.tabs.sendMessage(tabIdImageSearch, {
                target: 'images',
                action: 'ASK_IMAGES',
                selection: message.selection
            });
            // }
            sendResponse("INFORMATION WAS ASKED FROM COMTENT->BACKGROUND TO ->PINEDTABS");
        } else {
            //TODO: TENEMOS QUE ABRIR LOS TABS SI NO EXISTEN
        }


    }

    if (message.target === 'background' && message.action === 'ASK_LARGER_IMAGE_LINK') {
        message.target = 'images';
        chrome.tabs.sendMessage(tabIdImageSearch, message, (response) => {            
            sendResponse(response);
        });
    }

    if (message.target === 'background' && message.action === 'SEE_STORED_DATA') {

        chrome.tabs.create({ url: chrome.runtime.getURL("store/stored_data.html") });

    }

    if (message.target === 'background' && message.action === 'STUDY_ELEMENTS') {

        chrome.tabs.create({ url: chrome.runtime.getURL("store/study_elements.html") });

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