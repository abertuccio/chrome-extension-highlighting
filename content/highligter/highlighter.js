class HighlighterActions {
    constructor() {
        this.hgltTranslationWord = document.getElementById("hglt-translation-word");
        this.hgltMeaningDefinition = document.getElementById("hglt-meaning-definition");
        this.hgltWordSelected = document.getElementById("hglt-word-selected");
        this.hgltImage = document.getElementById("hglt-image");
        this.hgltImageLoader = document.getElementById("hglt-image-loader");
        this.hgltAddStore = document.getElementById("hglt-add-store");
        this.arrows = document.getElementsByClassName("hglt-arrow");
        this.count = 1;
        this.translationLoader = setInterval(() => {
            (this.count < 4) ? this.count++ : this.count = 1;
            this.hgltTranslationWord.innerText = Array(this.count).fill(".").join(" ");
            this.hgltMeaningDefinition.innerText = Array(4 - this.count).fill(".").join(" ");
        }, 900);
    }




    startLoader() {

        [...this.arrows].forEach(arrow => {
            arrow.style.display = 'none';
        });
        this.hgltImage.style.display = 'none';
        this.hgltImageLoader.style.display = 'inline-block';
        this.hgltAddStore.style.display = 'none';
        // this.translationLoader;

    }

    setTranslation(data) {
        clearInterval(this.translationLoader);
        this.hgltTranslationWord.innerText = data.result.translation;
        this.hgltWordSelected.innerText = data.selection;
        this.hgltAddStore.style.display = 'block';
    }
}


