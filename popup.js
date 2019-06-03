const storedElements = document.getElementById("stored-elements")

storedElements.addEventListener("click", function(){

    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'seeStoredData'}, function (response) {

        currentTabId = response;

    });

})