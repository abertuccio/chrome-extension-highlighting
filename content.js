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
    'font-size': '14px',
    'cursor': 'pointer',
    'padding' : '3px 8px;'
}

const playButtonStyles = {
    'width': '74px',
    'height': '74px',
    'border-style': 'solid',
    'border-width': '37px 0px 37px 74px',
    'border-color': 'transparent transparent transparent #202020',
    'cursor': 'pointer'
}


const imgWrapperStyles = {
    'text-align': 'center',
    'margin-top': '6px',
    'margin-bottom': '6px',
    'clear': 'both',
    'height': '100px',
    'padding': '6px'
}

const prevStyles = {
    'display': 'block',
    'border-top': '1px solid #666',
    'border-right': '1px solid #666',
    'width': '20px',
    'height': '20px',
    'transform': 'rotate(-136deg)',
    'float': 'left',
    'margin-top': '17%',
    'cursor': 'pointer'
}

const nextStyles = {
    'display': 'block',
    'border-top': '1px solid #666',
    'border-right': '1px solid #666',
    'width': '20px',
    'height': '20px',
    'transform': 'rotate(45deg)',
    'float': 'right',
    'margin-top': '17%',
    'cursor': 'pointer'
}

const imgStyles = {
    'max-height': "100px",
    'max-width': "300px"
    //'float': 'left',
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

playSoundButton.innerHTML = "Sound";
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
let prevSelection = null;
let oRange = null;
let position = null;
let currentImage = 0;
let activeUI = false;
let images = [];

button.addEventListener("click", function () {

    let data = {};
    data.selection = textSelection;
    data.translation = textTranslation;
    data.image = imageURL;

    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'storeData', 'data': data }, function (response) {
        currentTabId = response;
    });

})

prev.addEventListener("click", () => {

    img.src = images[--currentImage]
})

next.addEventListener("click", () => {

    img.src = images[++currentImage]
})



document.addEventListener("selectionchange", event => {
    sel = window.getSelection()
    selection = sel.toString();
    oRange = sel.getRangeAt(0);
    position = oRange.getBoundingClientRect();
})

playSoundButton.addEventListener("click", () => {
    activeUI = true;
    var msg = new SpeechSynthesisUtterance(selection);
    window.speechSynthesis.speak(msg);
})

window.addEventListener('click', function (e) {
    if (!div.contains(e.target) && activeUI) {
        div.style.top = "-300px";
        activeUI = false;
    }
});

window.onmouseup = () => {


    if (!activeUI && selection && selection.length > 2 && selection.length < 100) {

        currentImage = 0;
        prev.style.display = 'none';
        next.style.display = 'none';
        img.src = "";


        textSelection = selection;
        span.innerHTML = `Add "<b>${selection}</b>" to the store?`;
        let positionY = ((position.y - 185) < 0) ? (position.y + position.height + 3) : (position.y - 185)
        div.style.top = positionY + "px";
        div.style.left = position.x + "px";

        chrome.runtime.sendMessage({ 'target': 'back', 'action': 'newSearch', 'search': textSelection });

        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

            images = [];

            if (message.target === 'content' && message.action === 'images') {

                images = message.response.images

                img.src = images[currentImage]


                imageURL = images[currentImage]

                if(!images[currentImage - 1]){ 
                    console.log("no hay imagenes")                   
                   prev.style.display = 'none';
                }else{
                    prev.style.display = 'block'; 
                }


                if(!images[currentImage + 1]){
                    next.style.display = 'none';
                 }else{
                    next.style.display = 'block'; 
                }

                

            }
            if (message.target === 'content' && message.action === 'translation') {

                translation.innerHTML = "";

                textTranslation = message.response.resultTable.translation;

                translation.innerHTML = message.response.resultTable.search + "  |  <b>" + message.response.resultTable.translation + "</b>"

                div.appendChild(translation);



                translation.appendChild(playSoundButton)


                img.addEventListener("load", () => {
                    let marginWarapper = (+div.offsetWidth + 12 - (+img.offsetWidth + 80)) / 2
                    marginWarapper = (marginWarapper < 0)?0:marginWarapper;
                    //imgWrapper.style.marginLeft = marginWarapper + "px";
                    prev.style.display = 'block';
                    next.style.display = 'block';
                    activeUI = true;
                });

            }

        });



    } else {
        //div.style.top = "-300px";
    }

}


onscroll = function (e) { div.style.top = "-300px"; }



chrome.runtime.onMessage.addListener()

