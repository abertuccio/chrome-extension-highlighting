class HighlighterActions {
    constructor(speachObject) {
        this.speachObject = speachObject;
        this.data = null;
        this.hgltImage = document.getElementById("hglt-image");
        this.arrows = document.getElementsByClassName("hglt-arrow");
        this.hgltAddStore = document.getElementById("hglt-add-store");
        this.hgltImageLoader = document.getElementById("hglt-image-loader");
        this.hgltMeaningsWrapper = document.getElementById("hglt-meanings");
        this.hgltWordSelected = document.getElementById("hglt-word-selected");
        this.hgltImageWrapper = document.getElementById("hglt-image-wrapper");
        this.hgltImageDivisor = document.getElementById("hglt-image-divisor");
        this.hgltImagesArrow = document.querySelectorAll(".hglt-images-arrow");
        this.hgltTranslationWrapper = document.getElementById("hglt-translation");
        this.hgltTranslationWord = document.getElementById("hglt-translation-word");
        this.hgltMeaningsDivisor = document.getElementById("hglt-meanings-divisor");
        this.hgltTranslationSound = document.getElementById("hglt-translation-sound");
        this.hgltAddStoreSaving = document.getElementById("hglt-add-store-saving");
        this.hgltAddStoreStoreStudy = document.getElementById("hglt-add-store-store-study");
        this.hgltSeeStoredElements = document.getElementById("hglt-see-stored-elements");
        this.hgltStudyElements = document.getElementById("hglt-study-elements");
        // this.hgltTranslationSound.src = chrome.extension.getURL("content/highligter/baseline-volume_up-24px.svg");
        this.hgltMeaningDefinition = document.getElementById("hglt-meaning-definition");
        this.hgltTranslationDivisor = document.getElementById("hglt-translation-divisor");
        this.hgltImagesArrowLeft = document.querySelectorAll(".hglt-images-arrow.hglt-left-arrow")[0];
        this.hgltImagesArrowRight = document.querySelectorAll(".hglt-images-arrow.hglt-right-arrow")[0];
        this.hgltMeaningsArrowLeft = document.querySelectorAll(".hglt-meanings-arrow.hglt-left-arrow")[0];
        this.hgltMeaningsArrowRight = document.querySelectorAll(".hglt-meanings-arrow.hglt-right-arrow")[0];
        this.hgltTranslationArrowLeft = document.querySelectorAll(".hglt-translation-arrow.hglt-left-arrow")[0];
        this.hgltTranslationArrowRight = document.querySelectorAll(".hglt-translation-arrow.hglt-right-arrow")[0];
        //TODO: MEJORAR ESTO DE LOS SETTING POR DEFECTO
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
        this.count = 1;
        this.translationLoader = setInterval(() => {
            (this.count < 4) ? this.count++ : this.count = 1;
            this.hgltTranslationWord.innerText = Array(this.count).fill(".").join(" ");
            this.hgltMeaningDefinition.innerText = Array(4 - this.count).fill(".").join(" ");
        }, 900);
        this.images = null;
        this.currentImageIndex = 0;
        this.translations = null;
        this.currentTranslationIndex = 0;
        this.definitions = null;
        this.currentDefinitionIndex = 0;
        this.startListeners();
    }


    startListeners() {

        this.hgltSeeStoredElements.addEventListener("click", ()=>{
console.log("veriamos los elementos guardados");
        });

        this.hgltStudyElements.addEventListener("click", ()=>{
            console.log("veriamos la pantalla para estudiar los elementos guardados");            
        })


        this.hgltTranslationSound.addEventListener("click", () => {
            window.speechSynthesis.speak(this.speachObject);
        });

        this.hgltAddStore.addEventListener("click", (e) => {

            this.hgltAddStore.style.display = 'none';
            this.hgltAddStoreSaving.style.display = 'block';

            chrome.runtime.sendMessage({
                'target': 'background',
                'action': 'ASK_LARGER_IMAGE_LINK',
                'index': this.currentImageIndex
            }, (srcResponse)=>{                
               chrome.storage.local.get({ 'hgltStoredElement': [] }, (result) => {
                   this.data.result.image = srcResponse;
                   result.hgltStoredElement.push(this.data.result);
                   chrome.storage.local.set({ 'hgltStoredElement': result.hgltStoredElement }, (res)=>{
                    this.hgltAddStoreSaving.style.display = 'none';
                    this.hgltAddStoreStoreStudy.style.display = 'block';
                   });
               });
            });

        });

        this.hgltImageWrapper.addEventListener("click", (e) => {

            const next = this.getAreaPositionNext(e);

            if (next && this.currentImageIndex > this.images.length - 1) { return; }
            if (!next && this.currentImageIndex - 1 < 0) { return; }

            var idx = (next) ? ++this.currentImageIndex : --this.currentImageIndex;
            const image = this.images[idx];
            this.hgltImage.src = (image || this.hgltImage.src);
            this.adjustImage();
            if (next) {
                this.hgltImagesArrowLeft.style.display = (this.currentImageIndex > 0) ? 'block' : 'none';
                this.hgltImagesArrowRight.style.display = (this.currentImageIndex + 1 > this.images.length - 1) ? 'none' : 'block';

            } else {
                this.hgltImagesArrowRight.style.display = (this.currentImageIndex < this.images.length - 1) ? 'block' : 'none';
                this.hgltImagesArrowLeft.style.display = (this.currentImageIndex - 1 < 0) ? 'none' : 'block';
            }


        });

        this.hgltTranslationWrapper.addEventListener("click", (e) => {

            const next = this.getAreaPositionNext(e);

            //TODO: VER PORQUE PUEDE PASAR QUE SEA NULL O UN ARRAY VACIO
            if (this.translations.length) { return; }

            if (next && this.currentTranslationIndex > this.translations.length - 1) { return; }
            if (!next && this.currentTranslationIndex - 1 < 0) { return; }

            var idx = (next) ? ++this.currentTranslationIndex : --this.currentTranslationIndex;
            const translation = this.translations[idx];
            this.hgltTranslationWord.innerText = (translation || this.hgltTranslationWord.innerText);
            this.hgltTranslationWord.title = (translation || this.hgltTranslationWord.innerText);
            if (next) {
                this.hgltTranslationArrowLeft.style.display = (this.currentTranslationIndex > 0) ? 'block' : 'none';
                this.hgltTranslationArrowRight.style.display = (this.currentTranslationIndex + 1 > this.translations.length - 1) ? 'none' : 'block';

            } else {
                this.hgltTranslationArrowRight.style.display = (this.currentTranslationIndex < this.translations.length - 1) ? 'block' : 'none';
                this.hgltTranslationArrowLeft.style.display = (this.currentTranslationIndex - 1 < 0) ? 'none' : 'block';
            }


        });

        this.hgltMeaningsWrapper.addEventListener("click", (e) => {

            const next = this.getAreaPositionNext(e);

            if (next && this.currentDefinitionIndex > this.definitions.length - 1) { return; }
            if (!next && this.currentDefinitionIndex - 1 < 0) { return; }

            var idx = (next) ? ++this.currentDefinitionIndex : --this.currentDefinitionIndex;
            const definition = this.definitions[idx];
            this.hgltMeaningDefinition.innerText = (definition || this.hgltMeaningDefinition.innerText);
            this.hgltMeaningDefinition.title = (definition || this.hgltMeaningDefinition.title);
            if (next) {
                this.hgltMeaningsArrowLeft.style.display = (this.currentDefinitionIndex > 0) ? 'block' : 'none';
                e.target.style.display = (this.currentDefinitionIndex + 1 > this.definitions.length - 1) ? 'none' : 'block';

            } else {
                this.hgltMeaningsArrowRight.style.display = (this.currentDefinitionIndex < this.definitions.length - 1) ? 'block' : 'none';
                e.target.style.display = (this.currentDefinitionIndex - 1 < 0) ? 'none' : 'block';
            }

        });

        this.hgltTranslationWrapper.addEventListener("mouseover", (e) => {

            if (this.getAreaPositionNext(e)) {
                this.addHoverArrow(this.hgltTranslationArrowRight);
                this.removeHoverArrow(this.hgltTranslationArrowLeft);
            } else {
                this.addHoverArrow(this.hgltTranslationArrowLeft);
                this.removeHoverArrow(this.hgltTranslationArrowRight);
            }

        });


        this.hgltImageWrapper.addEventListener("mouseover", (e) => {

            if (this.getAreaPositionNext(e)) {
                this.addHoverArrow(this.hgltImagesArrowRight);
                this.removeHoverArrow(this.hgltImagesArrowLeft);
            } else {
                this.addHoverArrow(this.hgltImagesArrowLeft);
                this.removeHoverArrow(this.hgltImagesArrowRight);
            }

        });

        this.hgltMeaningsWrapper.addEventListener("mouseover", (e) => {

            if (this.getAreaPositionNext(e)) {
                this.addHoverArrow(this.hgltMeaningsArrowRight);
                this.removeHoverArrow(this.hgltMeaningsArrowLeft);
            } else {
                this.addHoverArrow(this.hgltMeaningsArrowLeft);
                this.removeHoverArrow(this.hgltMeaningsArrowRight);
            }

        });

        this.hgltImageWrapper.addEventListener("mouseleave", () => {
            this.removeHoverArrow(this.hgltImagesArrowLeft);
            this.removeHoverArrow(this.hgltImagesArrowRight);
        });

        this.hgltTranslationWrapper.addEventListener("mouseleave", () => {
            this.removeHoverArrow(this.hgltTranslationArrowLeft);
            this.removeHoverArrow(this.hgltTranslationArrowRight);
        });

        this.hgltMeaningsWrapper.addEventListener("mouseleave", () => {
            this.removeHoverArrow(this.hgltMeaningsArrowLeft);
            this.removeHoverArrow(this.hgltMeaningsArrowRight);
        });



    }

    addHoverArrow(element) { element.classList.add("hglt-arrow-hover"); }

    removeHoverArrow(element) { element.classList.remove("hglt-arrow-hover"); }

    getAreaPositionNext(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        return (x > rect.width / 2) ? true : false;
    }

    startLoader() {

        [...this.arrows].forEach(arrow => {
            arrow.style.display = 'none';
        });
        this.hgltImage.style.display = 'none';
        this.hgltImageLoader.style.display = 'inline-block';
        this.hgltAddStore.style.display = 'none';
        this.hgltAddStoreStoreStudy.style.display = 'none';
        this.translationLoader;

    }

    applySettings() {

        if (this.settingsData.translation.avalible) {
            this.hgltTranslationWrapper.style.display = 'block';
            this.hgltTranslationDivisor.style.display = 'block';
        }
        else {
            this.hgltTranslationWrapper.style.display = 'none';
            this.hgltTranslationDivisor.style.display = 'none';
        }

        if (this.settingsData.pronunciation.avalible) {
            this.hgltTranslationSound.style.display = 'block';
            //TODO: NO ES LO IDEAL
            // this.hgltTranslationWord.style.width = '244px';
        }
        else {
            this.hgltTranslationSound.style.display = 'none';
            //TODO: NO ES LO IDEAL
            // this.hgltTranslationWord.style.width = '241px';
        }

        if (this.settingsData.definition.avalible) {
            this.hgltMeaningsWrapper.style.display = 'block';
            this.hgltMeaningsDivisor.style.display = 'block';
        }
        else {
            this.hgltMeaningsWrapper.style.display = 'none';
            this.hgltMeaningsDivisor.style.display = 'none';
        }

        if (this.settingsData.images.avalible) {
            this.hgltImageWrapper.style.display = 'block';
            this.hgltImageDivisor.style.display = 'block';
        }
        else {
            this.hgltImageWrapper.style.display = 'none';
            this.hgltImageDivisor.style.display = 'none';
        }
    }

    setTranslation(data) {
        this.applySettings();
        this.data = data;
        this.hgltAddStore.style.display = 'block';
        this.translations = data.result.translations;
        this.definitions = data.result.definitions;

        clearInterval(this.translationLoader);
        this.hgltTranslationWord.innerText = data.result.translations[0];
        this.hgltTranslationWord.title = data.result.translations[0];
        this.hgltMeaningDefinition.innerText = data.result.definitions[0];
        this.hgltMeaningDefinition.title = data.result.definitions[0];
        this.hgltTranslationWord.setAttribute('idx', 0);
        this.hgltMeaningDefinition.setAttribute('idx', 0);
        this.currentTranslationIndex = 0;
        this.currentDefinitionIndex = 0;

        this.hgltTranslationArrowRight.style.display = (data.result.translations.length > 1) ? 'block' : 'none';
        this.hgltMeaningsArrowRight.style.display = (data.result.definitions.length > 1) ? 'block' : 'none';


        this.hgltWordSelected.innerText = data.selection;
        this.hgltWordSelected.title = data.selection;
        // this.startListeners();
    }

    setImages(data) {
        this.applySettings();
        // this.data = data;
        this.images = data.result;
        this.hgltImageLoader.style.display = 'none';
        this.hgltImage.src = data.result[0];
        this.adjustImage();
        this.currentImageIndex = 0;
        this.hgltImage.setAttribute('idx', 0);
        this.hgltImage.style.display = 'inline-block';
        this.hgltImagesArrowRight.style.display = (data.result.length > 1) ? 'block' : 'none';

        this.hgltWordSelected.innerText = data.selection;
        this.hgltAddStore.style.display = 'block';
        // this.startListeners();
    }

    adjustImage() {
        setTimeout(() => {
            this.hgltImage.style.marginTop = (this.hgltImageWrapper.offsetHeight - this.hgltImage.offsetHeight) / 2 - 3 + "px";
            [...this.hgltImagesArrow].forEach(a => {
                a.style.marginTop = (this.hgltImageWrapper.offsetHeight - a.offsetHeight) / 2 + "px";
            })
        }, 50);
    }

    restoreInformation() {
        this.images = null;
        this.currentImageIndex = 0;
        this.translations = null;
        this.currentTranslationIndex = 0;
        this.definitions = null;
        this.currentDefinitionIndex = 0;
    }


}