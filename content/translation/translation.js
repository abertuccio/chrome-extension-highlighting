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

function mutate(mutations) {

    //TODO: HACER IN SET INTERVAL Y ESPERAR QUE CARGUE EL ID=SOURCE DE LA PAGINA OSEA EL TEXTO A BUSCAR


    setTimeout(() => {
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
        
    }, 200);
}


var target = document.querySelectorAll(".result-shield-container.tlid-copy-target")[0];
var observer = new MutationObserver(mutate);
var config = { characterData: true, attributes: true, childList: true, subtree: true };

observer.observe(target, config);