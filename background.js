chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'back' && message.action === 'newSearch') {
        var newSearch = `https://www.google.com/search?q=${message.search}&source=lnms&tbm=isch`;

        var newTranslation = `https://www.wordreference.com/es/translation.asp?tranword=${message.search}`

        chrome.tabs.create({ url: newSearch, active: false }, (sTab) => {
            chrome.tabs.create({ url: newTranslation, active: false }, (tTab) => {
                let tab1 = sTab.id;
                let tab2 = tTab.id;
                
                chrome.tabs.executeScript(tab1, { file: "imageSearch.js" }, function () {
                    chrome.tabs.sendMessage(tab1, { target: 'imageSearch'}, (response)=>{
                        chrome.tabs.sendMessage(sender.tab.id, { target: 'content', 'action':'images', response, 'idTab':tab1})
                    });
                });
                
                chrome.tabs.executeScript(tab2, { file: "translationSearch.js" }, function (response) {
                    chrome.tabs.sendMessage(tab2, { target: 'translation'}, (response)=>{
                        chrome.tabs.sendMessage(sender.tab.id, { target: 'content', 'action':'translation', response, 'idTab':tab2})
                    });
                });


            });
        });

    }

    if (message.target === 'back' && message.action === 'storeData') {
    
        if (localStorage.getItem("hlt")) {
            let prevValues = JSON.parse(localStorage.getItem("hlt"));
            prevValues.push(message.data);
            let actualValues = JSON.stringify(prevValues)
            localStorage.setItem("hlt", actualValues);
        } else {
            localStorage.setItem("hlt", JSON.stringify([message.data]));
        }

    }

    sendResponse(sender.tab.id)
});