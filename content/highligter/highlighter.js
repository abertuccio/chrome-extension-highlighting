class HighlighterActions {
    constructor() {
        this.hgltTranslationWord = document.getElementById("hglt-translation-word");
        this.hgltMeaningDefinition = document.getElementById("hglt-meaning-definition");
        this.hgltWordSelected = document.getElementById("hglt-word-selected");
        this.hgltImage = document.getElementById("hglt-image");
        this.hgltImageWrapper = document.getElementById("hglt-image-wrapper");
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

                if (imagesBehavior) {
                    idx = (next) ? ++this.currentImageIndex : --this.currentImageIndex;
                    const image = this.images[idx];
                    this.hgltImage.src = image;
                    this.adjustImage();
                    if (next) {
                        this.hgltImagesArrowLeft.style.display = (this.currentImageIndex > 0) ? 'block' : 'none';
                        e.target.style.display = (this.currentImageIndex + 1 > this.images.length - 1) ? 'none' : 'block';

                    } else {
                        this.hgltImagesArrowRight.style.display = (this.currentImageIndex < this.images.length - 1) ? 'block' : 'none';
                        e.target.style.display = (this.currentImageIndex - 1 < 0) ? 'none' : 'block';
                    }
                    // console.log(idx);
                }

                if (translationBehavior) {
                    idx = (next) ? ++this.currentTranslationIndex : --this.currentTranslationIndex;
                    const translation = this.translations[idx];
                    this.hgltTranslationWord.innerText = translation;
                    if (next) {
                        this.hgltTranslationArrowLeft.style.display = (this.currentTranslationIndex > 0) ? 'block' : 'none';
                        e.target.style.display = (this.currentTranslationIndex + 1 > this.translations.length - 1) ? 'none' : 'block';

                    } else {
                        this.hgltTranslationArrowRight.style.display = (this.currentTranslationIndex < this.translations.length - 1) ? 'block' : 'none';
                        e.target.style.display = (this.currentTranslationIndex - 1 < 0) ? 'none' : 'block';
                    }
                    // console.log(idx);
                }

                if (definitionsBehavior) {
                    idx = (next) ? ++this.currentDefinitionIndex : --this.currentDefinitionIndex;
                    const definition = this.definitions[idx];
                    this.hgltMeaningDefinition.innerText = definition;
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

    setTranslation(data) {
        this.translations = data.result.translations;
        this.definitions = data.result.definitions;

        clearInterval(this.translationLoader);
        this.hgltTranslationWord.innerText = data.result.translations[0];
        this.hgltMeaningDefinition.innerText = data.result.definitions[0];
        this.hgltTranslationWord.setAttribute('idx', 0);
        this.hgltMeaningDefinition.setAttribute('idx', 0);
        this.currentTranslationIndex = 0;
        this.currentDefinitionIndex = 0;

        this.hgltTranslationArrowRight.style.display = (data.result.translations.length > 1) ? 'block' : 'none';
        this.hgltMeaningsArrowRight.style.display = (data.result.definitions.length > 1) ? 'block' : 'none';


        this.hgltWordSelected.innerText = data.selection;
        this.hgltAddStore.style.display = 'block';
        // this.startArrowsActions();
    }

    setImages(data) {
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
}


