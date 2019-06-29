class Highlighter {
    constructor() {

        this.hgltActions = new HighlighterActions();
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
            }).catch(err => {
                console.error("we couldn't load the hilighter");
                this.deleteState();
            });
    }

    showHTML() {
        this.lookForInformation();
        hglt.boxActive = true;
        let positionY = ((this.selectionPosition.y - this.htmlElement.offsetHeight) < 0) ?
            (this.selectionPosition.y + this.selectionPosition.height) :
            (this.selectionPosition.y - this.htmlElement.offsetHeight)

        this.htmlElement.style.top = positionY + "px";
        this.htmlElement.style.left = this.selectionPosition.x + "px";
    }

    hideHTML(){
        if(this.htmlElement){
            this.htmlElement.style.top = '-1000px';
            this.htmlElement.style.left = '-1000px';
            this.hgltActions.startLoader();
        }
    }

    lookForInformation() {
        this.hgltActions.startLoader();

        if (this.selection) {
            chrome.runtime.sendMessage({
                'target': 'background',
                'action': 'newSearch',
                'searchSelection': this.selection
            });
        } else {
            //TODO: ver que hacer
        }       

    }

}
let hglt = new Highlighter();


document.addEventListener("selectionchange", (e) => {

    if (hglt.boxActive) return;
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

    hglt.selection = selection;

    if (!hglt.selection || hglt.selection.length < 2 || hglt.selection.length > 100) {
        hglt.deleteState();
        return;
    }

    hglt.candidate = true;

});

window.onmouseup = (e) => {if (hglt.candidate) hglt.showHTML();}

window.onscroll = (e) => { hglt.deleteState(); }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log(message);

    if(message.target === 'main-content' && message.action === 'sendInformation'){

        if(message.searchTerm === this.selection){
            console.log(message.result);
        }

    }

});