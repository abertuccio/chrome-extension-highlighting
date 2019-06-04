
let selectionLocation = { "x": 0, "y": 0 };
let textSelection = "";
let textTranslation = "";
let imageURL = "";
let currentTabId = null;

const div = document.createElement("div");
const imgWrapper = document.createElement("div");
var translation = document.createElement('div');
const span = document.createElement("span");
const button = document.createElement("button");
button.innerHTML = "Yes";
button.style.marginLeft = "20px";
button.addEventListener("click", function () {

    let data = {};
    data.selection = textSelection;
    data.translation = textTranslation;
    data.image = imageURL;


    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'storeData', 'data': data }, function (response) {

        currentTabId = response;

    });

})

div.appendChild(span)
div.appendChild(button)
div.appendChild(imgWrapper)
div.appendChild(translation)

div.style.position = "fixed";
div.style['background-color'] = "white";
div.style['box-shadow'] = "3px 3px 4px #AAA";
div.style.padding = "6px";
div.style.overflow = "auto";
div.style['max-height']= "300px";

document.body.appendChild(div);



let sel = null
let selection = null;
let oRange = null;
let position = null;

document.addEventListener("selectionchange", event => {
    sel = window.getSelection()
    selection = sel.toString();
    oRange = sel.getRangeAt(0);
    position = oRange.getBoundingClientRect();
})

window.onmouseup = () => {

    if (selection && selection.length > 2 && selection.length < 100) {
        textSelection = selection;
        span.innerHTML = `Add "<b>${selection}</b>" to the store?`;
        div.style.top = (position.y - 166) + "px";
        div.style.left = position.x + "px";

        chrome.runtime.sendMessage({ 'target': 'back', 'action': 'newSearch', 'search': textSelection });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

            if (message.target === 'content' && message.action === 'images') {
                imgWrapper.innerHTML = "";
                const img = document.createElement("img");
                img.src = message.response.images[0]
                img.style['max-height'] = "100px"
                imageURL = message.response.images[0]
                imgWrapper.appendChild(img);

            }
            if (message.target === 'content' && message.action === 'translation') {

                

                translation.innerHTML = "";

                textTranslation = message.response.resultTable.translation;

                translation.innerHTML = message.response.resultTable.search + " -> <b>" + message.response.resultTable.translation+"</b>"
                // template.innerHTML = message.response.resultTable;
                
                var playSound = document.createElement("button")
                playSound.innerHTML = "Play sound";

                playSound.addEventListener("click", ()=>{
                    var msg = new SpeechSynthesisUtterance('Hello World');
                    window.speechSynthesis.speak(msg);
                })


                // template.style.display = "block";
                div.appendChild(translation)
                translation.appendChild(playSound)
                // div.insertAdjacentHTML('beforeend',message.response.resultTable)

            }

        });



    } else {
        div.style.top = "-300px";
    }

}


onscroll = function (e) { div.style.top = "-300px"; }



chrome.runtime.onMessage.addListener()

