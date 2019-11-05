chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.target === 'translation' && request.action === 'ASK_TRANSLATION') {
        const translationURL = `https://translate.google.com/#view=home&op=translate&sl=${request.from}&tl=${request.to}&text=${request.selection}`;
        window.location.href = translationURL;
    }
    return true;
});


const searchData = function () {

    const element = document.querySelectorAll(".tlid-translation.translation")[0];

    var results = {};

    results.search = decodeURIComponent(window.location.href.split("=")[5]);

    if("innerText" in element){
        results.translations = [element.innerText];
    }else{
        results.translations = "";
    }

    var otherTranslations = document.querySelectorAll(".gt-baf-cell.gt-baf-word-clickable");

    var transliteration = document.querySelectorAll(".tlid-transliteration-content.transliteration-content.full");

    //TODO: VER QUE ESTO NO FUNCIONA
    if (transliteration.length && transliteration[0].innerText.length) {
        results.transliteration = transliteration[0].innerText;
    } else {
        results.transliteration = "";
    }

    if (otherTranslations.length) {
        [...otherTranslations].forEach(e => {
            if (/,/g.test(e.innerText)) {
                e.innerText.split(",").forEach(sub => {
                    results.translations.push(sub);
                })
            } else {
                results.translations.push(e.innerText);
            }
        })
    }

    // setTimeout(()=>{

    var defifitionGuess = document.querySelectorAll(".gt-def-row");

    results.definitions = (defifitionGuess.length) ? [...defifitionGuess].map(e => e.innerText) : [""];

    chrome.runtime.sendMessage({
        target: 'background',
        action: 'SEND_INFORMATION',
        kind: 'translation',
        selection: results.search,
        result: results
    });

    [...defifitionGuess].forEach(d => { d.remove() });
}



const mutateTranslation = (mutations) => {

    for (let i = 0; i < [...mutations].length - 1; i++) {

        const element = document.querySelectorAll(".tlid-translation.translation")[0];

        console.log(element.innerText);

        //TODO:NO ES UNA BUENA FORMA DE ELEGIR EL MUTADO
        if (!/\.\.\./g.test(element.innerText)) {

            searchData();

            break;

        }
    }
}


var targetTranslation = document.querySelectorAll(".tlid-results-container.results-container")[0];

var search = decodeURIComponent(window.location.href.split("=")[5]);
var actualSearch = document.getElementsByClassName("text-dummy")[0];
searchData();
var observerTranslation = new MutationObserver(mutateTranslation);
var configTranslation = { characterData: false, attributes: true, childList: false, subtree: false };
observerTranslation.observe(targetTranslation, configTranslation);


