class Popup {
    constructor() {
        this.storedElements = document.getElementById("stored-elements");
        this.studyElements = document.getElementById("study-elements");
        this.checkboxLabel = document.getElementById("checkbox-label");
        this.highlight = document.getElementById("highlight");
        this.settingsButton = document.getElementById("settings");
        this.settingText = document.getElementById("setting-text");
        this.translationCheckboxLabel = document.getElementById("translation-checkbox-label");
        this.definitionCheckboxLabel = document.getElementById("definition-checkbox-label");
        this.image = document.getElementById("image");
        this.imageCheckboxLabel = document.getElementById("image-checkbox-label");
        this.settings = document.getElementsByClassName("settings")[0];
        this.more = document.getElementById("more");
        this.translation = document.getElementById("translation");
        this.translationTarget = document.getElementById("translation-target");
        this.definition = document.getElementById("definition");
        this.definitionTarget = document.getElementById("definition-target");
        this.settingsData = {
            translation: {
                avalible: true,
                fromLang: 'auto',
                toLang: 'es',
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
        this.addActions();        
    }

    getState() {
        chrome.storage.sync.get({ 'hgltAvailible': false }, (result) => {
            this.setCheckboxState(result.hgltAvailible);
        });

        chrome.storage.sync.get({ 'hgltSettings': false }, (result) => {

            if (!result.hgltSettings) {
                chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
            } else {
                this.settingsData = result.hgltSettings;
            }
            this.setSettings(this.settingsData);
        });

    }

    addActions() {
        this.highlight.addEventListener("change", (e) => {
            chrome.storage.sync.set({ hgltAvailible: e.target.checked });
            this.setCheckboxState(e.target.checked);
        });

        this.settingsButton.addEventListener("click", () => {
            this.settings.classList.toggle("hide");
            (this.more.innerText === 'keyboard_arrow_down') ? this.more.innerText = 'keyboard_arrow_up' : more.innerText = 'keyboard_arrow_down';
        });

        this.translation.addEventListener("change", (e)=>{
            this.settingsData.translation.avalible = e.target.checked;            
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.translationTarget.addEventListener("change", (e)=>{
            //TODO: VER ESTO DE CAMBIARLO CUANDO SEA EL CASO
            this.settingsData.translation.fromLang = 'auto';
            this.settingsData.translation.toLang = e.target.value;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.definition.addEventListener("change", (e)=>{
            this.settingsData.definition.avalible = e.target.checked;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.definitionTarget.addEventListener("change", (e)=>{
            this.settingsData.definition.lang = e.target.value;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.image.addEventListener("change", (e)=>{
            this.settingsData.images.avalible = e.target.checked;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

    }

    setSettings(settings){
        this.translation.checked = settings.translation.avalible;
        this.translationTarget.value = settings.translation.toLang;
        this.definition.checked = settings.definition.avalible;
        this.definitionTarget.value = settings.definition.lang; 
        this.image.checked = settings.images.avalible;
    }

    setCheckboxState(state) {
        this.highlight.checked = state;
        this.checkboxLabel.innerText = (state) ? 'HGLT Activated' : 'Activate HGLT';
    }

}

const popup = new Popup();  

chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltSettings') {
            popup.setSettings(changes[key].newValue);
        }
    }

});