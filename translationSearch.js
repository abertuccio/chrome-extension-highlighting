// let resultTable = document.getElementsByClassName("WRD")[0].outerHTML;

let resultTable = {};

//valid for wordreference
// resultTable.search = (document.querySelectorAll(".FrWrd strong")[0].innerText || "");
// resultTable.translation = (document.querySelectorAll(".ToWrd")[1].innerText || "")

let searchGuess = document.querySelectorAll(".text-dummy");
resultTable.search = (searchGuess.length) ? (searchGuess[0].innerHTML || "") : "";

let translationGuess = document.querySelectorAll(".result-shield-container.tlid-copy-target");
resultTable.translation = (translationGuess.length) ?
    (translationGuess[0].innerText || "") : "";

let defifitionGuess = document.querySelectorAll(".gt-def-row");
resultTable.definition = (defifitionGuess.length) ? (defifitionGuess.innerText || ""):""; 

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.target === 'translation') {
            sendResponse({
                resultTable: resultTable
            });
        }
        window.close();
    });