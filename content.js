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
    'padding': '3px 8px;'
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
    'padding': '6px',
    'min-width': '152px'
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
translation.appendChild(playSoundButton);
document.body.appendChild(div);

button.innerHTML = "Yes";

button.addEventListener("click", function () {
    closeToolTipHL();
})

let isToolTipLoaded = false;
let selectionPosition = { "x": -1000, "y": -1000 };
let selection = "";
let isThereAselection = false;
let isToolTipVisible = false;
let isThereAMouseUp = false;
let images = [];
let areImagesLoading = false;
let isTranslationLoading = false;
let currentImage = 0;
let maxImageIndex = 0;

const closeToolTipHL = () => {

    div.style.top = "-1000px";
    div.style.left = "-1000px";
    isToolTipVisible = false;
    isToolTipLoaded = false;

}

const openToolTipHL = (e) => {

    if (e.type === 'selectionchange') isThereAselection = true;

    if (e.type === 'mouseup') isThereAMouseUp = true;

    if (isThereAselection && isThereAMouseUp) {

        let positionY = ((selectionPosition.y - 185) < 0) ?
            (selectionPosition.y + selectionPosition.height + 3) :
            (selectionPosition.y - 185)

        div.style.top = positionY + "px";
        div.style.left = selectionPosition.x + "px";
        isToolTipVisible = true;
        removePreviousInformation();
        lookForInformation();
    }

    isThereAMouseUp = false;

}


document.addEventListener("selectionchange", (e) => {
    isThereAselection = false;
    sel = window.getSelection()
    selection = sel.toString();
    oRange = sel.getRangeAt(0);

    try {
        selectionPosition = oRange.getBoundingClientRect();
    } catch (error) {
        selection = false;
    }

    if (selection && selection.length > 1 && selection.length < 100) {
        openToolTipHL(e);
    }

})

window.onmouseup = (e) => {
    isThereAMouseUp = false;
    openToolTipHL(e);
};

window.addEventListener('click', function (e) {

    if (!div.contains(e.target)) {

        let yBoundary = [selectionPosition.y, selectionPosition.top + selectionPosition.height];
        let xBoundary = [selectionPosition.x, selectionPosition.x + selectionPosition.width]

        if (!selectionPosition.width || e.clientY < yBoundary[0] || e.clientY > yBoundary[1]
            || e.clientX < xBoundary[0] || e.clientY > yBoundary[1]) {

            closeToolTipHL();
        }

    }
});

const removePreviousInformation = () => {
    span.innerHTML = ""
    translation.innerHTML = "";
    images = [];
    prev.style.display = 'none';
    next.style.display = 'none';
    maxImageIndex = 0;
    currentImage = 0;
}

const lookForInformation = async () => {

    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'newSearch', 'search': selection });
    
    areImagesLoading = true;
    isTranslationLoading = true;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {


        if (message.target === 'content' && message.action === 'images') {

            currentImage = 0;

            images = message.response.images;

            maxImageIndex = images.length - 1;

            img.src = images[currentImage];

            checkConsistencyImages();

            areImagesLoading = false;

        }

        if(selection.split(" ").length < 4){
            
            if (message.target === 'content' && message.action === 'translation') {
    
                translation.innerHTML = message.response.resultTable.search + "  |  <b>" + message.response.resultTable.translation + "</b>";
    
                isTranslationLoading = false;
            }

        }else{
            translation.innerHTML = "";
            isTranslationLoading = false;
        }



        if (!isTranslationLoading && !areImagesLoading) {
            isToolTipLoaded = true;
            drawToolTip();
        }

    })

}

const drawToolTip = () => {

    span.innerHTML = `Add "<b>${selection}</b>" to the store?`;


}

onscroll = function (e) { closeToolTipHL(); }

playSoundButton.addEventListener("click", () => {
    var msg = new SpeechSynthesisUtterance(selection);
    window.speechSynthesis.speak(msg);
})

const checkConsistencyImages = () => {
    (currentImage === 0) ? prev.style.display = 'none' : prev.style.display = 'block';
    (currentImage === maxImageIndex) ? next.style.display = 'none' : next.style.display = 'block';
}

prev.addEventListener("click", () => {
    img.src = images[--currentImage];
    checkConsistencyImages();
})

next.addEventListener("click", () => {
    img.src = images[++currentImage];
    checkConsistencyImages();
})