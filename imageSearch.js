let img = "";

let imgs = [...document.querySelectorAll(".rg_ic.rg_i")].reduce((a, c) => {
    if (c.src) { a.push(c.src); } return a;
}, [])

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.target === 'imageSearch') {
            sendResponse({
                images: imgs
            });
        }
    });
