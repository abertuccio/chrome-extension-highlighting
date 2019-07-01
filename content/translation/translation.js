chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    // console.log("SE SOLICITA ACTUALIZAR LA PAGINA ---------------------");
    // console.log(request);
    // console.log("SE SOLICITA ACTUALIZAR LA PAGINA ---------------------");


    if (request.target === 'translation' && request.action === 'ASK_TRANSLATION') {
        const translationURL = `https://translate.google.com/#view=home&op=translate&sl=auto&tl=auto&text=${request.selection}`;
        window.location.href = translationURL;
        // window.location = window.location;
    }
    return true;
});


const mutateTranslation = (mutations) => {    
    
    for (let i = 0; i < [...mutations].length - 1; i++) {
    
        
        const element = document.querySelectorAll(".tlid-translation.translation")[0];
                
        //TODO:NO ES UNA BUENA FORMA DE ELEGIR EL MUTADO
        if (!/\.\.\./g.test(element.innerText)) {
            
            var resultTable = {};
            
            resultTable.search = decodeURIComponent(window.location.href.split("=")[5]);

            resultTable.translation = element.innerText

            var defifitionGuess = document.querySelectorAll(".gt-def-row");
            // console.log(defifitionGuess);
            resultTable.definition = (defifitionGuess.length) ? (defifitionGuess[0].innerText || "") : "";

            // console.log("mandamos");
            // console.log(resultTable);

            chrome.runtime.sendMessage({
                target: 'background',
                action: 'SEND_INFORMATION',
                kind: 'translation',
                selection: resultTable.search,
                result: resultTable
            });

            break;

        }
    }
}


var targetTranslation = document.querySelectorAll(".tlid-results-container.results-container")[0];
var observerTranslation = new MutationObserver(mutateTranslation);
var configTranslation = { characterData: false, attributes: true, childList: false, subtree: false };
observerTranslation.observe(targetTranslation, configTranslation);

// const mutateDefinition = (mutations) => {
// console.log(mutations);
// }


// var targetDefinition = document.querySelectorAll(".tlid-results-container.results-container")[0];
// var observerDefinition = new MutationObserver(mutateDefinition);
// var configDefinition = { characterData: false, attributes: true, childList: false, subtree: false };
// observerDefinition.observe(targetDefinition, configDefinition);

document.addEventListener('DOMContentLoaded', function() {
    // your code here
 }, false);