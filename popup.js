const storedElements = document.getElementById("stored-elements");
const studyElements = document.getElementById("study-elements");
const checkboxLabel = document.getElementById("checkbox-label");
const highlight = document.getElementById("highlight");
const settingsButton = document.getElementById("settings");
const settingText = document.getElementById("setting-text");
const translationCheckboxLabel = document.getElementById("translation-checkbox-label");
const definition = document.getElementById("definition");
const definitionCheckboxLabel = document.getElementById("definition-checkbox-label");
const image = document.getElementById("image");
const imageCheckboxLabel = document.getElementById("image-checkbox-label");
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

let hltSettings = {
    isActive: false,
    translation: true,
    targetTranslation: 'en',
    definition: false,
    targetDefinition: 'en',
    image: true
}

window.onload = () => {
    getSettings();
    settingText.innerText = settings_T;
    translationCheckboxLabel.innerText = translation_T;
    definitionCheckboxLabel.innerText = definition_T;
    imageCheckboxLabel.innerText = image_T;
    storedElements.innerText = storedElements_T;
    studyElements.innerText = studyStoredElements_T;
}

if (hltSettings.translation) {
    translation.removeAttribute("checked");
    translation.setAttribute("checked", "");
} else {
    translation.removeAttribute("checked");
}

if (hltSettings.definition) {
    definition.removeAttribute("checked");
    definition.setAttribute("checked", "");
} else {
    definition.removeAttribute("checked");
}

if (hltSettings.image) {
    image.removeAttribute("checked");
    image.setAttribute("checked", "");
} else {
    image.removeAttribute("checked");
}


settingsButton.addEventListener("click", () => {
    settings.classList.toggle("hide");
    (more.innerText === 'keyboard_arrow_down') ? more.innerText = 'keyboard_arrow_up' : more.innerText = 'keyboard_arrow_down';
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

highlight.addEventListener("change", () => {

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

translation.addEventListener("change", () => {

    if (translation.checked) {
        console.log("hay que activar el select");
    }
    else {
        console.log("hay que desactivar el select");
    }

    changeSettings("translation", translation.checked);

});


const changeSettings = (settingValue, value) => {
    chrome.runtime.sendMessage({
        'target': 'back',
        'action': 'changeSettings',
        'settingValue': settingValue,
        'value': value
    }, function (response) {

    });
}

const getSettings = () => {
    chrome.runtime.sendMessage({
        'target': 'back',
        'action': 'getSettings'
    }, function (hltSettings) {
        hltSettings = hltSettings;
    });
}




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



