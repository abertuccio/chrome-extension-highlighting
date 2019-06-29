let resultTable = {};

let searchGuess = document.querySelectorAll(".text-dummy");
resultTable.search = (searchGuess.length) ? (searchGuess[0].innerHTML || "") : "";

let translationGuess = document.querySelectorAll(".result-shield-container.tlid-copy-target");
resultTable.translation = (translationGuess.length) ?
    (translationGuess[0].innerText || "") : "";

let defifitionGuess = document.querySelectorAll(".gt-def-row");
resultTable.definition = (defifitionGuess.length) ? (defifitionGuess.innerText || "") : "";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
        if (request.target === 'getTranslation') {
            const translationURL = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${request.searchSelection}`;
            window.location.href = translationURL;
        }
        return true;
    });

chrome.runtime.sendMessage({
    target: 'background',
    action: 'sendInformation',
    kind: 'translation',
    searchTerm: window.location.href.split("=")[5],
    result: resultTable
})