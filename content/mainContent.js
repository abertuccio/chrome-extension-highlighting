class Highlighter {
    constructor() {
        this.html = false;
        this.HGLTAvailible = false;
        this.siteAllowed = false;
        this.selection = null;
        this.context = null;
        this.candidate = false;
        this.boxActive = false;
        this.hgltActions = null;
        this.htmlElement = null;
        this.selectionPosition = null;
        this.waitingTranslation = false;
        this.waitingImages = false;
        this.settingsData = {
            translation: {
                avalible: true,
                fromLang: 'auto',
                toLang: 'auto',
            },
            pronunciation: {
                avalible: true,
                lang: 'en-US',
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
            this.HGLTAvailible = result.hgltAvailible;
            chrome.storage.sync.get({ 'hgltSitesNotAvailables': [] }, (resultSiteAvailable) => {
                const currentDomain = window.location.href.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1];
                const state = !resultSiteAvailable.hgltSitesNotAvailables.includes(currentDomain);
                this.siteAllowed = state;
                chrome.storage.sync.get({ 'hgltSettings': false }, (resultSettings) => {
                    if (resultSettings.hgltSettings) {
                        this.settingsData = resultSettings.hgltSettings;
                        //TODO: VER OTRA MANERA DE ACTUALIZAR/PONER LOS DATOS DE SETTINGS
                        if (this.hgltActions) {
                            this.hgltActions.settingsData = resultSettings.hgltSettings;
                        }
                    }
                });
            });
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
                this.hgltActions.hgltImage.onload = () => {
                    this.hgltActions.adjustImageContainer();
                    this.positionHLTML();
                }
                //TODO: LOS SETTING POR PRIMERA VEZ HAY QUE VER SI ESTA BIEN PONERLO ASI;
                this.hgltActions.settingsData = this.settingsData;
            }).catch(err => {
                console.log(err);
                console.error("we couldn't load the hilighter");
                this.deleteState();
            });
    }

    showHTML() {

        if (!this.siteAllowed || !this.HGLTAvailible) return;

        this.waitingTranslation = true;
        this.waitingImages = true;

        this.lookForInformation();

        setTimeout(() => {
            if (this.waitingTranslation || this.waitingImages) {
                this.lookForInformation();
            }
        }, 4000);

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
        if (!this.selectionPosition) return;

        let positionY = ((this.selectionPosition.y - this.htmlElement.offsetHeight) < 20) ?
            (this.selectionPosition.y + this.selectionPosition.height) :
            (this.selectionPosition.y - this.htmlElement.offsetHeight)

        this.htmlElement.style.top = positionY + "px";
        this.htmlElement.style.left = this.selectionPosition.x + "px";
    }

    lookForInformation() {
        this.hgltActions.startLoader();

        if (!this.selection) { return; }

        try {
            chrome.runtime.sendMessage({
                'target': 'background',
                'action': 'ASK_TRANSLATION_AND_IMAGES',
                'selection': this.selection,
                'settings': this.settingsData,
            }, (info) => {
                console.log(info);
            });

        } catch (error) {
            this.hgltActions.hgltTranslationWrapper.style.display = 'none';
            this.hgltActions.hgltTranslationDivisor.style.display = 'none';
            this.hgltActions.hgltTranslationSound.style.display = 'none';
            this.hgltActions.hgltMeaningsWrapper.style.display = 'none';
            this.hgltActions.hgltMeaningsDivisor.style.display = 'none';
            this.hgltActions.hgltImageDivisor.style.display = 'none';
            this.hgltActions.hgltImageWrapper.style.display = 'none';
            this.hgltActions.innerHTML = this.hgltActions.innerHTML;             
            this.hgltActions.hgltAddStore.style.display = 'block';
            this.hgltActions.hgltAddStore.innerHTML = 'A new version of <b>HGLT</b> is available, we should refresh this tab';
            this.hgltActions.hgltAddStore.addEventListener("click", (e)=>{
                window.location.reload();
            });
        }

    }

}
let hglt = new Highlighter();


document.addEventListener("selectionchange", (e) => {

    const activeElement = document.activeElement.nodeName;

    const input = (activeElement === 'INPUT' ||
        activeElement === 'TEXTAREA' ||
        activeElement === 'CODE' ||
        activeElement === 'PRE' ||
        false);

    if (!hglt.siteAllowed || !hglt.HGLTAvailible || hglt.boxActive || input) return;
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
    hglt.context = (window.getSelection().focusNode.data || "");




    hglt.hgltActions.speachObject = new SpeechSynthesisUtterance(hglt.selection);
    hglt.hgltActions.speachObject.lang = (hglt.settingsData.pronunciation.lang || 'en-US');


    if (!hglt.selection || hglt.selection.length < 2 || hglt.selection.length > 100) {
        hglt.deleteState();
        return;
    }

    hglt.candidate = true;

});

window.onmouseup = (e) => { if (hglt.candidate && !hglt.boxActive) hglt.showHTML(); }

// window.ondblclick = (e) => {
//     if (!hglt.boxActive) {
//         setTimeout(() => {
//             if (hglt.candidate) {
//                 hglt.showHTML();
//             }
//         }, 50)
//     }
// }

window.onscroll = (e) => { hglt.deleteState(); }

window.addEventListener('click', function (e) {

    if (hglt.boxActive && !hglt.htmlElement.contains(e.target)) {

        hglt.deleteState();

    } else {
        //TODO: VER SI ESTA BIEN REPOSICIONAR ACA
        if (hglt.boxActive) {
            hglt.positionHLTML();
        }
        //TODO: VER SI HAY QUE HACER ALGO ACA
        //LAS ACCIONES ACA LAS MANEJA hgltActions
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.target === 'main-content' && message.action === 'SEND_INFORMATION') {

        if (message.selection === hglt.selection && message.kind === 'translation') {
            message.result.context = hglt.context;
            hglt.waitingTranslation = false;
            hglt.hgltActions.setTranslation(message);
        }

        //TODO: VER DE EVENTUALMENTE SEPARAR TRANSLATION Y DEFINITION
        // if (message.selection === hglt.selection && message.kind === 'definition') {
        //     // console.log(message);
        //     // hglt.hgltActions.setTranslation(message);
        //     console.log("se envio la definicion");
        // }

        if (message.selection === hglt.selection && message.kind === 'images') {
            hglt.waitingImages = false;
            hglt.hgltActions.setImages(message);
        }

    }

    return true;

});


chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltAvailible') {
            hglt.HGLTAvailible = changes[key].newValue;
            if (changes[key].newValue) hglt.deleteState();
        }

        if (key === 'hgltSettings') {
            //TODO: LA MANERA DE ACTUALIZAR LOS DATOS EN HGLTACTIONS NO SE SI ES LA IDEAL
            hglt.hgltActions.settingsData = changes[key].newValue;
            hglt.hgltActions.applySettings();
            hglt.settingsData = changes[key].newValue;
            hglt.positionHLTML();
        }

        if (key === 'hgltSitesNotAvailables') {

            const currentDomain = window.location.href.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1];
            const state = !changes[key].newValue.includes(currentDomain);
            hglt.siteAllowed = state;

        }

    }

});

chrome.storage.sync.get({ 'hgltAvailible': false }, (result) => {
    hglt.HGLTAvailible = result.hgltAvailible;
});