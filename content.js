const wrapperStyles = {
    'position': 'fixed',
    'background-color': 'white',
    'box-shadow': '3px 3px 4px #AAA',
    'padding': '6px',
    'overflow': 'auto',
    'max-height': '300px',
    'font-size': '14px',
    'z-index': "9999999999999999999999999999999999999999999999999999999999999999999999999999",
    'border': '1px solid #e4e4e4',
    'border-radius': '5px',
    'color': '#545454',
    'text-align': 'center'
}

const buttonStyles = {
    'margin-left': '20px',
    'background-color': '#0095ff',
    'border': '1px solid #0095ff',
    'color': '#FFF',
    'border-radius': '4px',
    'font-size': '14px'
}

const playButtonStyles = {
    'width': '74px',
    'height': '74px',
    'border-style': 'solid',
    'border-width': '37px 0px 37px 74px',
    'border-color': 'transparent transparent transparent #202020'
}


const imgWrapperStyles = {
    'text-align': 'center',
    'margin': '6px auto',
    'max-width': '187px',
    'clear': 'both',
    'height': '100px'
}

const prevStyles = {
    'display': 'block',
    'border-top': '1px solid #666',
    'border-right': '1px solid #666',
    'width': '20px',
    'height': '20px',
    'transform': 'rotate(-136deg)',
    'float': 'left',
    'margin-top': '17%'
}

const nextStyles = {
    'display': 'block',
    'border-top': '1px solid #666',
    'border-right': '1px solid #666',
    'width': '20px',
    'height': '20px',
    'transform': 'rotate(45deg)',
    'float': 'left',
    'margin-top': '17%'
}

const imgStyles = {
    'max-height' : "100px",
    'max-width' : '147px',
    'float':'left',
}

const div = document.createElement("div");
const imgWrapper = document.createElement("div");
const img = document.createElement("img");
const prev = document.createElement("div");
const next = document.createElement("div");
const translation = document.createElement('div');
const span = document.createElement("span");
const button = document.createElement("button");
const playSoundButton = document.createElement("button")

Object.assign(div.style, wrapperStyles);
Object.assign(imgWrapper.style, imgWrapperStyles);
Object.assign(img.style, imgStyles);
Object.assign(prev.style, prevStyles);
Object.assign(next.style, nextStyles);
Object.assign(button.style, buttonStyles);
Object.assign(playSoundButton.style, buttonStyles);

div.appendChild(span);
div.appendChild(button);
imgWrapper.appendChild(prev);
imgWrapper.appendChild(img);
imgWrapper.appendChild(next);
div.appendChild(imgWrapper);
div.appendChild(translation);
document.body.appendChild(div);

button.innerHTML = "Yes";


let selectionLocation = { "x": 0, "y": 0 };
let textSelection = "";
let textTranslation = "";
let imageURL = "";
let currentTabId = null;
let sel = null
let selection = null;
let oRange = null;
let position = null;


button.addEventListener("click", function () {

    let data = {};
    data.selection = textSelection;
    data.translation = textTranslation;
    data.image = imageURL;

    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'storeData', 'data': data }, function (response) {
        currentTabId = response;
    });

})


document.addEventListener("selectionchange", event => {
    sel = window.getSelection()
    selection = sel.toString();
    oRange = sel.getRangeAt(0);
    position = oRange.getBoundingClientRect();
    console.log(position)
})


window.onmouseup = () => {

    if (selection && selection.length > 2 && selection.length < 100) {
        textSelection = selection;
        span.innerHTML = `Add "<b>${selection}</b>" to the store?`;
        let positionY = ((position.y - 185) < 0) ? (position.y + position.height + 3) : (position.y - 185)
        div.style.top = positionY + "px";
        div.style.left = position.x + "px";

        chrome.runtime.sendMessage({ 'target': 'back', 'action': 'newSearch', 'search': textSelection });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

            if (message.target === 'content' && message.action === 'images') {

                img.src = message.response.images[0]
                
                imageURL = message.response.images[0]

            }
            if (message.target === 'content' && message.action === 'translation') {



                translation.innerHTML = "";

                textTranslation = message.response.resultTable.translation;

                translation.innerHTML = message.response.resultTable.search + "  |  <b>" + message.response.resultTable.translation + "</b>"
                // template.innerHTML = message.response.resultTable;


                playSoundButton.innerHTML = "Sound";

                playSoundButton.addEventListener("click", () => {
                    var msg = new SpeechSynthesisUtterance('Hello World');
                    window.speechSynthesis.speak(msg);
                })


                // template.style.display = "block";
                div.appendChild(translation)
                translation.appendChild(playSoundButton)
                // div.insertAdjacentHTML('beforeend',message.response.resultTable)

            }

        });



    } else {
        div.style.top = "-300px";
    }

}


onscroll = function (e) { div.style.top = "-300px"; }



chrome.runtime.onMessage.addListener()

