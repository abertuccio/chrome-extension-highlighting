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


const mutate = (mutations) => {

    
    
    for (let i = 0; i < [...mutations].length - 1; i++) {
    
        
        const element = document.querySelectorAll(".tlid-translation.translation")[0];
                
        if (!/\.\.\./g.test(element.innerText)) {
            
            var resultTable = {};
            
            resultTable.search = decodeURIComponent(window.location.href.split("=")[5]);

            resultTable.translation = element.innerText

            var defifitionGuess = document.querySelectorAll(".gt-def-row");
            console.log(defifitionGuess);
            resultTable.definition = (defifitionGuess.length) ? (defifitionGuess.innerText || "") : "";

            console.log("mandamos");
            console.log(resultTable);

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


var target = document.querySelectorAll(".tlid-results-container.results-container")[0];
var observer = new MutationObserver(mutate);
var config = { characterData: false, attributes: true, childList: false, subtree: false };

observer.observe(target, config);

///TODO: HACER OTRO OBSERVER PARA LAS DEFINICIONES!!