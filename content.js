const wrapperSelectionStyles = {
    'position': 'fixed',
    'background-color': '#FFF',
    'padding': '3px',
    'color': "#0095ff",
    'text-align': 'center',
    'box-shadow': '3px 3px 4px #AAA'
}

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
    'color': '#545454',
    'text-align': 'center',
    'max-width': '453px',
    'font-family': 'sans-serif',
    'font-size': '14px',
    'min-height': '171px'
}

const wrapperSelectionArrowStyles = {
    'width': '12px',
    'height': '12px',
    'transform': 'rotate(-136deg)',
    'background-color': '#FFF',
    'position': 'fixed',
    'z-index': "99999999999999999999999999999999999999999999999999999999999999999999999999999",
    'border-left': '1px solid #e4e4e4',
    'border-top': '1px solid #e4e4e4'

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
    'padding': '6px 16px',
    'min-width': '152px'
}

const prevStyles = {
    'display': 'block',
    'border-top': '1px solid #666',
    'border-right': '1px solid #666',
    'width': '20px',
    'height': '20px',
    'transform': 'rotate(-136deg)',
    'cursor': 'pointer',
    'position': 'absolute',
    'top': '45%',
    'left': '6%'
}

const translationStyles = {
    'height': '16px',
    'white-space': 'nowrap',
    'overflow': 'hidden',
    'text-overflow': 'ellipsis'
}

const nextStyles = {
    'display': 'block',
    'border-top': '1px solid #666',
    'border-right': '1px solid #666',
    'width': '20px',
    'height': '20px',
    'transform': 'rotate(45deg)',
    'cursor': 'pointer',
    'position': 'absolute',
    'top': '45%',
    'right': '6%'
}

const imgStyles = {
    'max-height': "100px",
    'max-width': "300px",
    'margin': '0px 10px'
    //'float': 'left',
}

const wrapperSelection = document.createElement("div");
const wrapperSelectionArrow = document.createElement("div");
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
Object.assign(wrapperSelectionArrow.style, wrapperSelectionArrowStyles)
Object.assign(imgWrapper.style, imgWrapperStyles);
Object.assign(img.style, imgStyles);
Object.assign(prev.style, prevStyles);
Object.assign(next.style, nextStyles);
Object.assign(translation.style, translationStyles);
Object.assign(button.style, buttonStyles);
Object.assign(playSoundButton.style, buttonStyles);
Object.assign(wrapperSelection.style, wrapperSelectionStyles);

div.appendChild(span);
div.appendChild(button);
imgWrapper.appendChild(prev);
imgWrapper.appendChild(img);
imgWrapper.appendChild(next);
div.appendChild(imgWrapper);
div.appendChild(translation);
translation.appendChild(playSoundButton);
document.body.appendChild(wrapperSelection);
document.body.appendChild(div);
//TODO: POR AHORA LO SACAMOS, HAY QUE ACOMODARLO CON LA ALTURA DE LA SELECTION 
// document.body.appendChild(wrapperSelectionArrow);

span.style.cursor = 'pointer';
translation.style.cursor = 'pointer';
translation.title = 'Play sound';
span.innerHTML = `Loading...`;
button.innerHTML = "Yes";
button.style.display = 'none';

span.onmouseenter = () => { span.style.color = '#0095ff'; }
span.onmouseleave = () => { span.style.color = '#666'; }
translation.onmouseenter = () => { translation.style.color = '#0095ff'; }
translation.onmouseleave = () => { translation.style.color = '#666'; }
prev.onmouseenter = () => { prev.style.borderColor = "#0095ff"; }
prev.onmouseleave = () => { prev.style.borderColor = "#666"; }
next.onmouseenter = () => { next.style.borderColor = "#0095ff"; }
next.onmouseleave = () => { next.style.borderColor = "#666"; }

let isActive = false;
let isToolTipLoaded = false;
let selectionPosition = { "x": -1000, "y": -1000 };
let selection = "";
let textSearched = "";
let textTranslation = "";
let isThereAselection = false;
let isToolTipVisible = false;
let isThereAMouseUp = false;
let images = [];
let areImagesLoading = false;
let isTranslationLoading = false;
let currentImage = 0;
let maxImageIndex = 0;

span.addEventListener("click", function (e) {
    let data = {};
    data.selection = textSearched;
    data.translation = textTranslation;
    data.image = images[currentImage];

    chrome.runtime.sendMessage({ 'target': 'back', 'action': 'storeData', 'data': data }, function (response) {
        currentTabId = response;
        span.innerHTML = `<b>"${textSearched}"</b> was stored`;
        button.style.display = 'none';
    });
})

const closeToolTipHL = () => {

    button.style.display = 'none';
    div.style.top = "-1000px";
    div.style.left = "-1000px";
    wrapperSelection.style.top = "-1000px";
    wrapperSelection.style.left = "-1000px";
    wrapperSelectionArrow.style.top = "-1000px";
    wrapperSelectionArrow.style.left = "-1000px";

    isToolTipVisible = false;
    isToolTipLoaded = false;

}

const openToolTipHL = (e) => {

    if(!isActive) return;

    if (e.type === 'selectionchange') isThereAselection = true;

    if (e.type === 'mouseup') isThereAMouseUp = true;

    if (isThereAselection && isThereAMouseUp && !button.contains(e.target) && !prev.contains(e.target) && !next.contains(e.target)) {

        // wrapperSelection.style.width = selectionPosition.width*1.14 + 16 + "px";
        // wrapperSelection.style.height = selectionPosition.height + "px";
        // wrapperSelection.style.top = selectionPosition.top - 2 + "px";
        // wrapperSelection.style.left = selectionPosition.x - 2 + "px";
        // wrapperSelection.style.lineHeight = selectionPosition.height + "px";
        // wrapperSelection.innerHTML = selection;
        wrapperSelectionArrow.style.top = selectionPosition.top - 21 + "px";
        wrapperSelectionArrow.style.left = selectionPosition.x + 8 + "px";

        if ((selectionPosition.y - 185) < 0) {
            wrapperSelectionArrow.style.top = selectionPosition.y + selectionPosition.height + 6 + "px";
            wrapperSelectionArrow.style.borderBottom = '1px solid #e4e4e4';
            wrapperSelectionArrow.style.borderRight = '1px solid #e4e4e4';
            wrapperSelectionArrow.style.borderTop = 'none';
            wrapperSelectionArrow.style.borderLeft = 'none';
            wrapperSelectionArrow.style.boxShadow = 'none';
        } else {
            wrapperSelectionArrow.style.borderBottom = 'none';
            wrapperSelectionArrow.style.borderRight = 'none';
            wrapperSelectionArrow.style.borderTop = '1px solid #e4e4e4';
            wrapperSelectionArrow.style.borderLeft = '1px solid #e4e4e4';
            wrapperSelectionArrow.style.boxShadow = 'rgb(170, 170, 170) -2px -2px 2px';
        }

        let positionY = ((selectionPosition.y - 185) < 0) ?
            (selectionPosition.y + selectionPosition.height + 12) :
            (selectionPosition.y - 185)

        div.style.top = positionY + "px";
        div.style.left = selectionPosition.x - 3 + "px";
        isToolTipVisible = true;
        removePreviousInformation();
        lookForInformation();
    }

    isThereAMouseUp = false;

}


document.addEventListener("selectionchange", (e) => {
    if(!isActive) return;
    isThereAselection = false;
    sel = window.getSelection();
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
    span.innerHTML = "Loading...";
    translation.innerHTML = "";
    images = [];
    img.src = "";
    prev.style.display = 'none';
    next.style.display = 'none';
    maxImageIndex = 0;
    currentImage = 0;
}

const lookForInformation = async () => {

    if(!isActive) return;

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

        if (selection.split(" ").length < 4) {

            if (message.target === 'content' && message.action === 'translation') {

                textSearched = selection;

                textTranslation = message.response.resultTable.translation;

                translation.innerHTML = message.response.resultTable.search + "  |  <b>" + message.response.resultTable.translation + "</b>";

                isTranslationLoading = false;
            }

        } else {
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

translation.addEventListener("click", () => {
    var msg = new SpeechSynthesisUtterance(selection);
    window.speechSynthesis.speak(msg);
})

const checkConsistencyImages = () => {
    (currentImage === 0) ? prev.style.display = 'none' : prev.style.display = 'block';
    (currentImage === maxImageIndex) ? next.style.display = 'none' : next.style.display = 'block';
}

prev.addEventListener("click", (e) => {
    e.preventDefault();
    img.src = images[--currentImage];
    checkConsistencyImages();
}, false)

next.addEventListener("click", (e) => {
    e.preventDefault();
    img.src = images[++currentImage];
    checkConsistencyImages();
}, false)


chrome.extension.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'content' && message.action === 'changeHighlight') {

        console.log("-----")
        console.log("recibimos notificacion de que cambio")
        console.log(message.value)
        console.log("-----")

        if(!message.value){            
            isActive = false;
            closeToolTipHL();
        }else{
            isActive = true;
        }
    }

});

chrome.runtime.sendMessage({ 'target': 'back', 'action': 'getHighlight' },(response)=>{

    if (response === 'true') {
        isActive = true;
    }
    else {
        isActive = false;
        closeToolTipHL();
    }

});