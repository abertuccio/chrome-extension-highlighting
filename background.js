
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
    if (!tabIdTranslation && !tabIdImageSearch) {
    createSearchTabs("example");
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // target: 'background',
    // action: 'sendInformation',
    // kind: 'translation',
    // searchTerm: currentLocation.href.split("=")[5],
    // result: resultTabl

    if (message.target === 'background' && message.action === 'sendInformation') {

        message.target = 'main-content';
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                console.log(tab.id);
                chrome.tabs.sendMessage(tab.id, message);
            });
        });

    }

    if (message.target === 'background' && message.action === 'newSearch') {

        if (tabIdTranslation && tabIdImageSearch) {

            console.log(`Enviamos informacion a ${tabIdTranslation}`)
            
            chrome.tabs.sendMessage(tabIdTranslation, {
                target: 'getTranslation',
                searchSelection: message.searchSelection
            });

            chrome.tabs.sendMessage(tabIdImageSearch, {
                target: 'getImages',
                searchSelection: message.searchSelection
            });
        }else{
            //TODO: VER QUE HACER ACA
        }


    }

    

    return true;
});