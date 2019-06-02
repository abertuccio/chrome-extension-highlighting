chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target == 'back') {
        var newSearch = `https://www.google.com/search?q=${message.search}&source=lnms&tbm=isch`;

        var newTranslation = `https://www.wordreference.com/es/translation.asp?tranword=${message.search}`

        chrome.tabs.create({ url: newSearch, active: false }, (sTab) => {
            chrome.tabs.create({ url: newTranslation, active: false }, (tTab) => {
                let tab1 = sTab.id;
                let tab2 = tTab.id;
                
                chrome.tabs.executeScript(tab1, { file: "imageSearch.js" }, function () {
                    chrome.tabs.sendMessage(tab1, { target: 'imageSearch'}, function(response){
                        chrome.tabs.sendMessage(sender.tab.id, { target: 'content', response})
                    });
                });
                
                chrome.tabs.executeScript(tab2, { file: "translationSearch.js" }, function () {
                    chrome.tabs.sendMessage(tab2, { target: 'translationSearch', requestId: sender.tab.id });
                });


            });
        });

    }

    sendResponse(sender.tab.id)
});