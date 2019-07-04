chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.target === 'images' && request.action === 'ASK_IMAGES') {
        const imageSearchURL = `https://www.google.com/search?q=${request.selection}&source=lnms&tbm=isch`;
        window.location.href = imageSearchURL;
    }
    return true;
});



// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         if (request.target === 'getImages') {
//             sendResponse({
//                 images: imgs
//             });
//         }
//     });

const mutateImages = (mutations) => {
    
    if (mutations.length > 5) {

        //TODO: GUARDAR ESTAS IMAGENES AFUERA CUANDO EL USUARIO ELIJA GUARDAR EL 
        //ELEMENTO, HAY QUE HACER CLICK Y GUARDAR el vinculo de LA GRANDE 
        //si guardamos el index hacemos document.getElementsByClassName("irc_mi")[INDEX].CLICK()
        //quiza hay que esperar unos milisegundos
        //document.getElementsByClassName("irc_mi")[0, 1 o 2].currentSrc
        let imgs = [...document.querySelectorAll(".rg_ic.rg_i")].reduce((a, c) => {
            if (c.src) { a.push(c.src); } return a;
        }, [])


        chrome.runtime.sendMessage({
            target: 'background',
            action: 'SEND_INFORMATION',
            kind: 'images',
            selection: decodeURIComponent(window.location.href.split("=")[1].split("&")[0]),
            result: imgs
        });

        observerImages.disconnect();

    }
}


var targetImages = document.querySelectorAll("#search")[0];
var observerImages = new MutationObserver(mutateImages);
var configImages = { characterData: true, attributes: true, childList: true, subtree: true };
observerImages.observe(targetImages, configImages);