class Highlighter {
    constructor() {

        this.hgltActions = null;
        this.html = false;
        this.candidate = false;
        this.selection = null;
        this.boxActive = false;
        this.selectionPosition = null;

        this.getHTML();
        this.htmlElement = null;
    }

    deleteState() {
        this.html = false;
        this.candidate = false;
        this.selection = null;
        this.boxActive = false;
        this.selectionPosition = null;
        this.hideHTML();
        //TODO: agregar que borre los datos del html que creo que no funciona
    }

    getHTML() {

        fetch(chrome.extension.getURL('content/highligter/highlighter.html'))
            .then(response => response.text())
            .then(data => {
                const hglt = document.createElement('hglt');
                hglt.innerHTML = data;
                document.documentElement.appendChild(hglt);
                this.html = true;
                this.htmlElement = document.getElementById("hglt");
                this.hgltActions = new HighlighterActions();
            }).catch(err => {
                console.error("we couldn't load the hilighter");
                this.deleteState();
            });
    }

    showHTML() {
        this.lookForInformation();

        setTimeout(() => {
            hglt.boxActive = true;
        }, 1000);

        let positionY = ((this.selectionPosition.y - this.htmlElement.offsetHeight) < 0) ?
            (this.selectionPosition.y + this.selectionPosition.height) :
            (this.selectionPosition.y - this.htmlElement.offsetHeight - 30)

        this.htmlElement.style.top = positionY + "px";
        this.htmlElement.style.left = this.selectionPosition.x + "px";
    }

    hideHTML() {
        if (this.htmlElement) {
            this.htmlElement.style.top = '-1000px';
            this.htmlElement.style.left = '-1000px';
            this.hgltActions.startLoader();
            this.hgltActions.restoreInformation();
            // this.hgltActions = new HighlighterActions();
        }
    }

    lookForInformation() {
        this.hgltActions.startLoader();

        if (this.selection) {
            chrome.runtime.sendMessage({
                'target': 'background',
                'action': 'ASK_TRANSLATION_AND_IMAGES',
                'selection': this.selection
            }, (info) => {
                console.log("informacion solicitada");
                console.log("backround says: " + info);
                console.log("informacion solicitada");
            });
        } else {
            //TODO: ver que hacer
        }

        //TODO: SAXCAR ESTO
        // this.hideHTML();
        // this.deleteState();

    }

}
let hglt = new Highlighter();


document.addEventListener("selectionchange", (e) => {

    const activeElement = document.activeElement.nodeName;
    const input = (activeElement === 'INPUT' || activeElement === 'TEXTAREA' || false);

    if (hglt.boxActive || input) return;
    hglt.selection = null;
    const sel = window.getSelection();
    const selection = sel.toString();

    try {
        const oRange = sel.getRangeAt(0);
        hglt.selectionPosition = oRange.getBoundingClientRect();
    } catch (error) {
        hglt.deleteState();
        return;
    }

    hglt.selection = selection.trim();

    if (!hglt.selection || hglt.selection.length < 2 || hglt.selection.length > 100) {
        hglt.deleteState();
        return;
    }

    hglt.candidate = true;

});

window.onmouseup = (e) => { if (hglt.candidate && !hglt.boxActive) hglt.showHTML(); }

window.onscroll = (e) => { hglt.deleteState(); }

window.addEventListener('click', function (e) {

    if (hglt.boxActive && !hglt.htmlElement.contains(e.target)) {

        hglt.deleteState();

    } else {
        //TODO: VER SI HAY QUE HACER ALGO ACA
        //LAS ACCIONES ACA LAS MANEJA hgltActions
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'main-content' && message.action === 'SEND_INFORMATION') {

        if (message.selection === hglt.selection && message.kind === 'translation') {
            console.log(message);
            hglt.hgltActions.setTranslation(message);
        }

        if (message.selection === hglt.selection && message.kind === 'images') {
            console.log(message);
            hglt.hgltActions.setImages(message);
        }

    }

});