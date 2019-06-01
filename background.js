chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    
    if (message.target == 'back') {
        var newSearch = `https://www.google.com/search?q=${message.search}&source=lnms&tbm=isch`;

        var newTranslation = `https://www.wordreference.com/es/translation.asp?tranword=${message.search}`

        chrome.tabs.create({ url: newSearch, active: false }, async (sTab) => {
            chrome.tabs.create({ url: newTranslation, active: false }, async (tTab) => {
                let tab1 = await sTab.id;
                let tab2 = await tTab.id;
                sendResponse({ sTab: tab1 , tTab: tab2 })
            });
        });

    }
});