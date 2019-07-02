class HighlighterActions {
    constructor() {
        this.hgltTranslationWord = document.getElementById("hglt-translation-word");
        this.hgltMeaningDefinition = document.getElementById("hglt-meaning-definition");
        this.hgltWordSelected = document.getElementById("hglt-word-selected");
        this.hgltImage = document.getElementById("hglt-image");
        this.hgltImageLoader = document.getElementById("hglt-image-loader");
        this.hgltAddStore = document.getElementById("hglt-add-store");
        this.arrows = document.getElementsByClassName("hglt-arrow");
        this.hgltTranslationArrowLeft = document.querySelectorAll(".hglt-translation-arrow.hglt-left-arrow")[0];
        this.hgltTranslationArrowRight = document.querySelectorAll(".hglt-translation-arrow.hglt-right-arrow")[0];
        this.hgltMeaningsArrowLeft = document.querySelectorAll(".hglt-meanings-arrow.hglt-left-arrow")[0];
        this.hgltMeaningsArrowRight = document.querySelectorAll(".hglt-meanings-arrow.hglt-right-arrow")[0];
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
    }


    startArrowsActions() {
        [...this.arrows].forEach(arrow => {
            arrow.addEventListener("click", (e) => {    
                console.log("click en arrow"); 
               //TODO: ACA LAS ACCIONES DE LAS FLECHAS
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

        this.hgltTranslationArrowRight.style.display = (data.result.translations.length > 1) ? 'block' : 'none';
        this.hgltMeaningsArrowRight.style.display = (data.result.definitions.length > 1) ? 'block' : 'none';


        this.hgltWordSelected.innerText = data.selection;
        this.hgltAddStore.style.display = 'block';
        this.startArrowsActions();
    }

    setImages(data) {
        this.images = data.result;
        this.hgltImageLoader.style.display = 'none';
        this.hgltImage.src = data.result[0];
        this.hgltImage.setAttribute('idx', 0);
        this.hgltImage.style.display = 'inline-block';
        this.hgltImagesArrowRight.style.display = (data.result.length > 1) ? 'block' : 'none';

        this.hgltWordSelected.innerText = data.selection;
        this.hgltAddStore.style.display = 'block';
        this.startArrowsActions();
    }
}


