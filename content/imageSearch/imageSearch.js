console.log("estamos en imageSearch")

let img = "";

let imgs = [...document.querySelectorAll(".rg_ic.rg_i")].reduce((a, c) => {
    if (c.src) { a.push(c.src); } return a;
}, [])

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.target === 'getImages') {
            sendResponse({
                images: imgs
            });
        }
    });