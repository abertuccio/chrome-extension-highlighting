class HighlighterActions {
    constructor() {
        this.hgltTranslationWrapper = document.getElementById("hglt-translation");
        this.hgltTranslationDivisor = document.getElementById("hglt-translation-divisor");
        this.hgltTranslationWord = document.getElementById("hglt-translation-word");
        this.hgltMeaningsWrapper = document.getElementById("hglt-meanings");
        this.hgltMeaningsDivisor = document.getElementById("hglt-meanings-divisor");
        this.hgltMeaningDefinition = document.getElementById("hglt-meaning-definition");
        this.hgltWordSelected = document.getElementById("hglt-word-selected");
        this.hgltImage = document.getElementById("hglt-image");
        this.hgltImageWrapper = document.getElementById("hglt-image-wrapper");
        this.hgltImageDivisor = document.getElementById("hglt-image-divisor");
        this.hgltImageLoader = document.getElementById("hglt-image-loader");
        this.hgltAddStore = document.getElementById("hglt-add-store");
        this.arrows = document.getElementsByClassName("hglt-arrow");
        this.hgltTranslationArrowLeft = document.querySelectorAll(".hglt-translation-arrow.hglt-left-arrow")[0];
        this.hgltTranslationArrowRight = document.querySelectorAll(".hglt-translation-arrow.hglt-right-arrow")[0];
        this.hgltMeaningsArrowLeft = document.querySelectorAll(".hglt-meanings-arrow.hglt-left-arrow")[0];
        this.hgltMeaningsArrowRight = document.querySelectorAll(".hglt-meanings-arrow.hglt-right-arrow")[0];
        this.hgltImagesArrow = document.querySelectorAll(".hglt-images-arrow");
        this.hgltImagesArrowLeft = document.querySelectorAll(".hglt-images-arrow.hglt-left-arrow")[0];
        this.hgltImagesArrowRight = document.querySelectorAll(".hglt-images-arrow.hglt-right-arrow")[0];
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
        this.startArrowsActions();
    }


    startArrowsActions() {
        [...this.arrows].forEach(arrow => {
            arrow.addEventListener("click", (e) => {
                // console.log(e.target);
                const next = (e.target.classList.value.includes('right')) ? true : false;
                const imagesBehavior = (e.target.classList.value.includes('images')) ? true : false;
                const translationBehavior = (e.target.classList.value.includes('translation')) ? true : false;
                const definitionsBehavior = (e.target.classList.value.includes('meanings')) ? true : false;
                var idx = 0;

                // if (imagesBehavior) {
                //     idx = (next) ? ++this.currentImageIndex : --this.currentImageIndex;
                //     const image = this.images[idx];
                //     this.hgltImage.src = image;
                //     this.adjustImage();
                //     if (next) {
                //         this.hgltImagesArrowLeft.style.display = (this.currentImageIndex > 0) ? 'block' : 'none';
                //         e.target.style.display = (this.currentImageIndex + 1 > this.images.length - 1) ? 'none' : 'block';

                //     } else {
                //         this.hgltImagesArrowRight.style.display = (this.currentImageIndex < this.images.length - 1) ? 'block' : 'none';
                //         e.target.style.display = (this.currentImageIndex - 1 < 0) ? 'none' : 'block';
                //     }
                //     // console.log(idx);
                // }

                // if (translationBehavior) {
                //     idx = (next) ? ++this.currentTranslationIndex : --this.currentTranslationIndex;
                //     const translation = this.translations[idx];
                //     this.hgltTranslationWord.innerText = translation;
                //     this.hgltTranslationWord.title = translation;
                //     if (next) {
                //         this.hgltTranslationArrowLeft.style.display = (this.currentTranslationIndex > 0) ? 'block' : 'none';
                //         e.target.style.display = (this.currentTranslationIndex + 1 > this.translations.length - 1) ? 'none' : 'block';

                //     } else {
                //         this.hgltTranslationArrowRight.style.display = (this.currentTranslationIndex < this.translations.length - 1) ? 'block' : 'none';
                //         e.target.style.display = (this.currentTranslationIndex - 1 < 0) ? 'none' : 'block';
                //     }
                //     // console.log(idx);
                // }

                if (definitionsBehavior) {
                    idx = (next) ? ++this.currentDefinitionIndex : --this.currentDefinitionIndex;
                    const definition = this.definitions[idx];
                    this.hgltMeaningDefinition.innerText = definition;
                    this.hgltMeaningDefinition.title = definition;
                    if (next) {
                        this.hgltMeaningsArrowLeft.style.display = (this.currentDefinitionIndex > 0) ? 'block' : 'none';
                        e.target.style.display = (this.currentDefinitionIndex + 1 > this.definitions.length - 1) ? 'none' : 'block';

                    } else {
                        this.hgltMeaningsArrowRight.style.display = (this.currentDefinitionIndex < this.definitions.length - 1) ? 'block' : 'none';
                        e.target.style.display = (this.currentDefinitionIndex - 1 < 0) ? 'none' : 'block';
                    }
                    // console.log(idx);
                }


            })
        });

        this.hgltImageWrapper.addEventListener("click", (e) => {

            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;
            const next = (x > rect.width / 2) ? true : false;

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

            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;
            const next = (x > rect.width / 2) ? true : false;
            
            
            if (next && this.currentTranslationIndex > this.translations.length - 1) { return; }
            if (!next && this.currentTranslationIndex - 1 < 0) { return; }
            
            var idx = (next) ? ++this.currentTranslationIndex : --this.currentTranslationIndex;
            const translation = this.translations[idx];
            this.hgltTranslationWord.innerText = (translation || this.hgltTranslationWord.innerText );
            this.hgltTranslationWord.title = (translation || this.hgltTranslationWord.innerText );
            if (next) {
                this.hgltTranslationArrowLeft.style.display = (this.currentTranslationIndex > 0) ? 'block' : 'none';
                this.hgltTranslationArrowRight.style.display = (this.currentTranslationIndex + 1 > this.translations.length - 1) ? 'none' : 'block';

            } else {
                this.hgltTranslationArrowRight.style.display = (this.currentTranslationIndex < this.translations.length - 1) ? 'block' : 'none';
                this.hgltTranslationArrowLeft.style.display = (this.currentTranslationIndex - 1 < 0) ? 'none' : 'block';
            }


        });

        this.hgltTranslationWrapper.addEventListener("mouseover", (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;
            const next = (x > rect.width / 2) ? true : false;
            //TODO: HACER ESTO CON TOGGLE CLASSES
            if (next) {
                this.hgltTranslationArrowLeft.style.color = "#dcdcdc";
                this.hgltTranslationArrowRight.style.color = "red";
            } else {
                this.hgltTranslationArrowLeft.style.color = "red";
                this.hgltTranslationArrowRight.style.color = "#dcdcdc";
            }

        });


        this.hgltImageWrapper.addEventListener("mouseover", (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;
            const next = (x > rect.width / 2) ? true : false;
            //TODO: HACER ESTO CON TOGGLE CLASSES
            if (next) {
                this.hgltImagesArrowLeft.style.color = "#dcdcdc";
                this.hgltImagesArrowRight.style.color = "red";
            } else {
                this.hgltImagesArrowLeft.style.color = "red";
                this.hgltImagesArrowRight.style.color = "#dcdcdc";
            }

        });

        this.hgltImageWrapper.addEventListener("mouseleave", () => {
            this.hgltImagesArrowLeft.style.color = "#dcdcdc";
            this.hgltImagesArrowRight.style.color = "#dcdcdc";
        });

        this.hgltTranslationWrapper.addEventListener("mouseleave", () => {
            this.hgltTranslationArrowLeft.style.color = "#dcdcdc";
            this.hgltTranslationArrowRight.style.color = "#dcdcdc";
        });


    }


    startLoader() {

        [...this.arrows].forEach(arrow => {
            arrow.style.display = 'none';
        });
        this.hgltImage.style.display = 'none';
        this.hgltImageLoader.style.display = 'inline-block';
        this.hgltAddStore.style.display = 'none';
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
        // this.startArrowsActions();
    }

    setImages(data) {
        this.applySettings();
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
        // this.startArrowsActions();
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


