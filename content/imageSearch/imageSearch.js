var img = [];
var ids = [];
var idxs = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.target === 'images' && request.action === 'ASK_IMAGES') {
        const imageSearchURL = `https://www.google.com/search?q=${request.selection}&source=lnms&tbm=isch`;
        window.location.href = imageSearchURL;
    }
    if (request.target === 'images' && request.action === 'ASK_LARGER_IMAGE_LINK') {
        // document.querySelectorAll(".rg_ic.rg_i")[metaInfo[request.index]].click(); 


        const id = request.idx ? request.idx : 0;

        console.log("------");
        console.log(id);
        console.log("------");

        [...document.querySelectorAll(".rg_i.Q4LuWd.tx8vtf")][id].click();


        // [...document.querySelectorAll(".rg_i.Q4LuWd.tx8vtf")][request.idx].click();

        // document.getElementById(request.id).click();



        setInterval(() => {
            let candidates = [...document.getElementsByClassName("n3VNCb")];

            if (candidates[1].src) {
                sendResponse(candidates[1].src);
            }
            else {
                for (let i = 0; i < candidates.length - 1; i++) {
                    if (candidates[i].src) {
                        sendResponse(candidates[i].src);
                        break;
                    }
                }
            }
        }, 500);
    }
    return true;
});

const mutateImages = (mutations) => {

    if (mutations.length > 0) {

        //TODO: GUARDAR ESTAS IMAGENES AFUERA CUANDO EL USUARIO ELIJA GUARDAR EL 
        //ELEMENTO, HAY QUE HACER CLICK Y GUARDAR el vinculo de LA GRANDE 
        //si guardamos el index hacemos document.getElementsByClassName("irc_mi")[INDEX].CLICK()
        //quiza hay que esperar unos milisegundos
        //document.getElementsByClassName("irc_mi")[0, 1 o 2].currentSrc
        imgs = [...document.querySelectorAll(".rg_i.Q4LuWd.tx8vtf")].reduce((a, c, i) => {
            if (c.src) {
                a.push(c.src);
                ids.push(c.id);
                idxs.push(i);
            }
            return a;
        }, [])


        chrome.runtime.sendMessage({
            target: 'background',
            action: 'SEND_INFORMATION',
            kind: 'images',
            selection: decodeURIComponent(window.location.href.split("=")[1].split("&")[0]),
            result: imgs,
            ids: ids,
            idxs: idxs
        });

        observerImages.disconnect();

    }
}


var targetImages = document.querySelectorAll("#islmp")[0];
var observerImages = new MutationObserver(mutateImages);
var configImages = { characterData: true, attributes: true, childList: true, subtree: true };
observerImages.observe(targetImages, configImages);