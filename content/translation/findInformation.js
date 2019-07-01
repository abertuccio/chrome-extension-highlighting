var resultTable = {};

var searchGuess = document.querySelectorAll(".text-dummy");
resultTable.search = (searchGuess.length) ? (searchGuess[0].innerHTML || "") : "";

var translationGuess = document.querySelectorAll(".result-shield-container.tlid-copy-target");
resultTable.translation = (translationGuess.length) ?
    (translationGuess[0].innerText || "") : "";

var defifitionGuess = document.querySelectorAll(".gt-def-row");
resultTable.definition = (defifitionGuess.length) ? (defifitionGuess.innerText || "") : "";

console.log("vamos a mandar");
console.log(resultTable);

chrome.runtime.sendMessage({
    target: 'background',
    action: 'SEND_INFORMATION',
    kind: 'translation',
    selection: window.location.href.split("=")[5],
    result: resultTable
});
