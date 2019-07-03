chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    console.log("SE SOLICITA UNA BUSQUEDA ---------------------");
    console.log(request);
    console.log("SE SOLICITA UNA BUSQUEDA ---------------------");


    if (request.target === 'translation' && request.action === 'ASK_TRANSLATION') {
        const translationURL = `https://translate.google.com/#view=home&op=translate&sl=${request.from}&tl=${request.to}&text=${request.selection}`;
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

            resultTable.translations = [element.innerText]

            var otherTranslations = document.querySelectorAll(".gt-baf-cell.gt-baf-word-clickable");

            if(otherTranslations.length){
                // resultTable.translations = [resultTable.translations, [...otherTranslations].map(t=>t.innerText)]
                [...otherTranslations].forEach(e=>{
                    if(/,/g.test(e.innerText)){
                        e.innerText.split(",").forEach(sub=>{
                            resultTable.translations.push(sub); 
                        })
                    }else{
                        resultTable.translations.push(e.innerText); 
                    }
                })
            }



            var defifitionGuess = document.querySelectorAll(".gt-def-row");
            // console.log(defifitionGuess);
             
            resultTable.definitions = (defifitionGuess.length) ? [...defifitionGuess].map(e=>e.innerText) : [];

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