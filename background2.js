let hltSettings = {
    isActive: false,
    translation: true,
    targetTranslation : 'en',
    definition: false,
    targetDefinition: 'en',
    image: true
}

chrome.runtime.onInstalled.addListener(function (details) {

    localStorage.setItem("hltSettings", JSON.stringify(hltSettings));
    localStorage.setItem("hlt", JSON.stringify([]));

});

if (localStorage.getItem("hltSettings")) {
    hltSettings = JSON.parse(localStorage.getItem("hltSettings"));
} else {
    localStorage.setItem("hltSettings", JSON.stringify(hltSettings));
}





chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // BING https://www.bing.com/images/search?q=dog&qpvt=dog&FORM=IGRE

    if (message.target === 'back' && message.action === 'newSearch') {
        var newSearch = `https://www.google.com/search?q=${message.search}&source=lnms&tbm=isch`;

        // var newTranslation = `https://www.wordreference.com/es/translation.asp?tranword=${message.search}`
        var newTranslation = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${message.search}`

        chrome.tabs.create({ url: newSearch, active: false }, (sTab) => {
            chrome.tabs.create({ url: newTranslation, active: false }, (tTab) => {
                let tab1 = sTab.id;
                let tab2 = tTab.id;

                chrome.tabs.executeScript(tab1, { file: "imageSearch.js" }, function () {
                    chrome.tabs.sendMessage(tab1, { target: 'imageSearch' }, (response) => {
                        chrome.tabs.sendMessage(sender.tab.id, { target: 'content', 'action': 'images', response, 'idTab': tab1 })
                    });
                });


                chrome.tabs.executeScript(tab2, { file: "translationSearch.js" }, function (response) {
                    chrome.tabs.sendMessage(tab2, { target: 'translation' }, (response) => {
                        chrome.tabs.sendMessage(sender.tab.id, { target: 'content', 'action': 'translation', response, 'idTab': tab2 })
                    });
                });

            });
        });

    }

    if (message.target === 'back' && message.action === 'storeData') {

        message.data.repetitions = 0;
        message.data.easinessFactor = 2.5;
        message.data.interval = 1;
        message.data.nextPracticeDate = 0;

        if (localStorage.getItem("hlt")) {
            let prevValues = JSON.parse(localStorage.getItem("hlt"));
            prevValues.push(message.data);
            let actualValues = JSON.stringify(prevValues)
            localStorage.setItem("hlt", actualValues);
        } else {
            localStorage.setItem("hlt", JSON.stringify([message.data]));
        }

    }

    if (message.target === 'back' && message.action === 'seeStoredData') {

        chrome.tabs.create({ url: chrome.runtime.getURL("stored_data.html"), }, (nTab) => {
            // console.log(nTab);
            // chrome.tabs.executeScript(nTab.id, { file: "storedData.js" }, (res)=>{
            //     chrome.tabs.sendMessage(nTab.id, { target: 'storedData', 'data': storedData });
            // });
        });

    }

    if (message.target === 'back' && message.action === 'studyElements') {

        chrome.tabs.create({ url: chrome.runtime.getURL("study_elements.html"), }, (nTab) => {
            
        });

    }

    if (message.target === 'back' && message.action === 'setHighlight') {

        localStorage.setItem("isHltActive", message.value);

        setIcon(message.value);

        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    target: 'content',
                    action: 'changeHighlight',
                    value: message.value
                }, function (response) { });
            });
        });
        sendResponse();
    }

    if (message.target === 'back' && message.action === 'getHighlight') {

        (localStorage.getItem("isHltActive") === 'true') ? setIcon(true) : setIcon(false);

        sendResponse(localStorage.getItem("isHltActive"));
    }

    if (message.target === 'back' && message.action === 'getStoredElements') {

        let storedElements = (localStorage.getItem("hlt")) ? JSON.parse(localStorage.getItem("hlt")).length : 0;
        sendResponse(storedElements);
    }

    if (message.target === 'back' && message.action === 'changeSettings') {

        hltSettings[message.settingValue] = message.value; 
        localStorage.setItem("hltSettings", JSON.stringify(hltSettings));
        sendResponse(hltSettings);

    }

    if (message.target === 'back' && message.action === 'getSettings') {
        sendResponse(hltSettings);        
    }


    try {
        if (sender && ('tab' in sender) && ('id' in sender.tab)) {
            sendResponse(sender.tab.id);
        }
    } catch (error) {
        console.log(error)
    }
});

const setIcon = (active) => {
    if (active) {
        chrome.browserAction.setIcon({
            path: 'pencil_active_64.png'
        });
    } else {
        chrome.browserAction.setIcon({
            path: 'pencil_64.png'
        });
    }

}