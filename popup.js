const storedElements = document.getElementById("stored-elements");
const studyElements = document.getElementById("study-elements");
const checkboxLabel = document.getElementById("checkbox-label");
const highlight = document.getElementById("highlight");
const settingsButton = document.getElementById("settings");
const settings = document.getElementsByClassName("settings")[0];
const more = document.getElementById("more");

const markerActivated_T = chrome.i18n.getMessage("markerActivated", "message");
const markerDeactivated_T = chrome.i18n.getMessage("markerDeactivated", "message");
const settings_T = chrome.i18n.getMessage("settings", "message");
const translation_T = chrome.i18n.getMessage("translation", "message");
const definition_T = chrome.i18n.getMessage("definition", "message");
const image_T = chrome.i18n.getMessage("image", "message");
const storedElements_T = chrome.i18n.getMessage("storedElements", "message");
const studyStoredElements_T = chrome.i18n.getMessage("studyStoredElements", "message");




settingsButton.addEventListener("click", ()=>{    
    settings.classList.toggle("hide");
    (more.innerText === 'keyboard_arrow_down')?more.innerText = 'keyboard_arrow_up':more.innerText = 'keyboard_arrow_down';
});


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
        checkboxLabel.innerHTML = markerActivated_T;
    }
    else {
        checkboxLabel.innerHTML = markerDeactivated_T;
    }

    chrome.runtime.sendMessage({
        'target': 'back',
        'action': 'setHighlight',
        'value': highlight.checked
    }, function (response) {

    });

})

chrome.runtime.sendMessage({ 'target': 'back', 'action': 'getHighlight' }, function (response) {

    if (response === 'true') {
        highlight.removeAttribute("checked");
        highlight.setAttribute("checked", "");
        checkboxLabel.innerHTML = markerActivated_T
    }
    else {
        highlight.removeAttribute("checked");
        checkboxLabel.innerHTML = markerDeactivated_T;
    }

});

chrome.runtime.sendMessage({ 'target': 'back', 'action': 'getStoredElements' }, function (response) {

    storedElements.innerHTML += " (" + response + ")";

});



