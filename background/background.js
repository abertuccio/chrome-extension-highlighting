
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

chrome.runtime.onInstalled.addListener(function (details) {

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


});


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


        console.log("vamos a buscar la mierda a los ids:");
        console.log(tabIdTranslation);
        console.log(tabIdImageSearch);
        console.log("vamos a buscar la mierda a los ids:");



        if (tabIdTranslation && tabIdImageSearch) {

            chrome.tabs.sendMessage(tabIdTranslation, {
                target: 'translation',
                action: 'ASK_TRANSLATION',
                selection: message.selection
            });

            chrome.tabs.sendMessage(tabIdImageSearch, {
                target: 'images',
                action: 'ASK_IMAGES',
                selection: message.selection
            });
            sendResponse("INFORMATION WAS ASKED FROM COMTENT->BACKGROUND TO ->PINEDTABS");
        } else {
            //TODO: TENEMOS QUE ABRIR LOS TABS SI NO EXISTEN
        }


    }



    return true;
});


// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
//     if (tabId === tabIdTranslation && changeInfo.status == 'complete') {

//         chrome.tabs.executeScript(tabIdTranslation, {
//             file: 'content/translation/findInformation.js'
//         });

//     }
//   })