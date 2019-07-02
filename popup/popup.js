class Popup {
    constructor() {
        this.storedElements = document.getElementById("stored-elements");
        this.studyElements = document.getElementById("study-elements");
        this.checkboxLabel = document.getElementById("checkbox-label");        
        this.highlight = document.getElementById("highlight");        
        this.settingsButton = document.getElementById("settings");
        this.settingText = document.getElementById("setting-text");
        this.translationCheckboxLabel = document.getElementById("translation-checkbox-label");
        this.definition = document.getElementById("definition");
        this.definitionCheckboxLabel = document.getElementById("definition-checkbox-label");
        this.image = document.getElementById("image");
        this.imageCheckboxLabel = document.getElementById("image-checkbox-label");
        this.settings = document.getElementsByClassName("settings")[0];
        this.more = document.getElementById("more");

        this.getState();
    }

    getState() {        
        chrome.storage.sync.get(['isHgltActive'], (result)=>{
            console.log(result);
            this.highlight.checked = ("isHgltActive" in result) ? result.isHgltActive.status : false;  
            this.checkboxLabel.innerText = ("isHgltActive" in result && result.isHgltActive.status) ? 'activado' : 'desactivado';          
        })
    }

}

const popup = new Popup();  