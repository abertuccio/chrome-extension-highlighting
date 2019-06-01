chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message.target == 'back'){
        var newSearch = `https://www.google.com/search?q=${message.search}&source=lnms&tbm=isch`;
        
        var newTranslation = `https://www.wordreference.com/es/translation.asp?tranword=${message.search}`
       
        chrome.tabs.create({ url: newSearch, active: false });
        chrome.tabs.create({ url: newTranslation, active: false });         
    }
  });