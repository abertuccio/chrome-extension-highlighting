class Highlighter {
    constructor() {
        this.html = false;
        this.allowed = true;
        this.selection = null;
        this.candidate = false;
        this.boxActive = false;
        this.hgltActions = null;
        this.htmlElement = null;
        this.selectionPosition = null;
        this.settingsData = {
            translation: {
                avalible: true,
                fromLang: 'auto',
                toLang: 'es',
            },
            pronunciation: {
                avalible: true
            },
            definition: {
                avalible: true,
                lang: 'en'
            },
            images: {
                avalible: true
            }
        };
        this.getState();
        this.getHTML();
    }

    getState() {
        chrome.storage.sync.get({ 'hgltAvailible': false }, (result) => {
            this.allowed = result.hgltAvailible;
        });

        chrome.storage.sync.get({ 'hgltSettings': false }, (result) => {
            if (result.hgltSettings) {
                this.settingsData = result.hgltSettings;
                //TODO: VER OTRA MANERA DE ACTUALIZAR/PONER LOS DATOS DE SETTINGS
                if (this.hgltActions) {
                    this.hgltActions.settingsData = result.hgltSettings;
                }
            }
        });
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
                //TODO: LOS SETTING POR PRIMERA VEZ HAY QUE VER SI ESTA BIEN PONERLO ASI;
                this.hgltActions.settingsData = this.settingsData;
            }).catch(err => {
                console.error("we couldn't load the hilighter");
                this.deleteState();
            });
    }

    showHTML() {

        if (!this.allowed) return;

        this.lookForInformation();

        setTimeout(() => {
            hglt.boxActive = true;
            this.positionHLTML();
        }, 1000);

        this.positionHLTML();
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

    positionHLTML() {
        let positionY = ((this.selectionPosition.y - this.htmlElement.offsetHeight) < 20) ?
            (this.selectionPosition.y + this.selectionPosition.height) :
            (this.selectionPosition.y - this.htmlElement.offsetHeight)

        this.htmlElement.style.top = positionY + "px";
        this.htmlElement.style.left = this.selectionPosition.x + "px";
    }

    lookForInformation() {
        this.hgltActions.startLoader();

        if (!this.selection) { return; }

        chrome.runtime.sendMessage({
            'target': 'background',
            'action': 'ASK_TRANSLATION_AND_IMAGES',
            'selection': this.selection,
            'settings': this.settingsData,
        }, (info) => {
            console.log("informacion solicitada");
            console.log("backround says: " + info);
            console.log("informacion solicitada");
        });
    }

}
let hglt = new Highlighter();


document.addEventListener("selectionchange", (e) => {

    const activeElement = document.activeElement.nodeName;
    const input = (activeElement === 'INPUT' || activeElement === 'TEXTAREA' || false);

    if (!hglt.allowed || hglt.boxActive || input) return;
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
        //TODO: VER SI ESTA BIEN REPOSICIONAR ACA
        if(hglt.boxActive){
            hglt.positionHLTML();
        }
        //TODO: VER SI HAY QUE HACER ALGO ACA
        //LAS ACCIONES ACA LAS MANEJA hgltActions
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'main-content' && message.action === 'SEND_INFORMATION') {

        if (message.selection === hglt.selection && message.kind === 'translation') {
            // console.log(message);
            hglt.hgltActions.setTranslation(message);
        }

        //TODO: VER DE EVENTUALMENTE SEPARAR TRANSLATION Y DEFINITION
        // if (message.selection === hglt.selection && message.kind === 'definition') {
        //     // console.log(message);
        //     // hglt.hgltActions.setTranslation(message);
        //     console.log("se envio la definicion");
        // }

        if (message.selection === hglt.selection && message.kind === 'images') {
            // console.log(message);
            hglt.hgltActions.setImages(message);
        }

    }

});


chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltAvailible') {
            hglt.allowed = changes[key].newValue;
            if (changes[key].newValue) hglt.deleteState();
        }

        if (key === 'hgltSettings') {
            //TODO: LA MANERA DE ACTUALIZAR LOS DATOS EN HGLTACTIONS NO SE SI ES LA IDEAL
            hglt.hgltActions.settingsData = changes[key].newValue;
            hglt.hgltActions.applySettings();
            hglt.settingsData = changes[key].newValue;
        }
    }

});
