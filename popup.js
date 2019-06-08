const storedElements = document.getElementById("stored-elements");
const studyElements = document.getElementById("study-elements");
const checkboxWrapper = document.getElementById("checkbox-wrapper");
const checkboxLabel = document.getElementById("checkbox-label");
const highlight = document.getElementById("highlight");

var markerActivated_T = chrome.i18n.getMessage("markerActivated", "message");

storedElements.addEventListener("click", function () {

    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'seeStoredData' }, function (response) {

        currentTabId = response;

    });

})

studyElements.addEventListener("click", function () {

    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'studyElements' }, function (response) {

        currentTabId = response;

    });

})

highlight.addEventListener("change", function () {

    if (highlight.checked) {
        checkboxWrapper.style.color = "#000";
        checkboxLabel.innerHTML = "Marcador activado";

    }
    else {
        checkboxWrapper.style.color = "#a5a5a5";
        checkboxLabel.innerHTML = "Marcador desactivado";
    }

    chrome.runtime.sendMessage({
        'target': 'back',
        'action': 'setHighlight',
        'value': highlight.checked
    }, function(response){
        
    });

})

chrome.runtime.sendMessage({ 'target': 'back', 'action': 'getHighlight' }, function (response) {    
    
    if (response === 'true') {
        highlight.checked = true;
        checkboxWrapper.style.color = "#000";
        checkboxLabel.innerHTML = "Marcador activado";
    }
    else {
        highlight.checked = false;
        checkboxWrapper.style.color = "#a5a5a5";
        checkboxLabel.innerHTML = "Marcador desactivado";
    }

});

chrome.runtime.sendMessage({ 'target': 'back', 'action': 'getStoredElements' }, function (response) {    
    
    storedElements.innerHTML += " ("+response+")";

});



