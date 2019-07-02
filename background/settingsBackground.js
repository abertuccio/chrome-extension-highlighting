chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'settings-background' && message.action === 'SET_HIGHLIGHT_STATE') {
    
        setIcon(message.value);
    
        message.target = 'main-content';
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, message, function (response) { 
                    console.log("TAB SAYS: "+response);
                });
            });
        });

        sendResponse("HIGHTLIGHT STATE WAS SENT");
    }
    
    if (message.target === 'settings-background' && message.action === 'GET_HIGHLIGHT_STATE') {
    
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