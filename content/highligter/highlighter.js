class HighlighterActions{
    constructor(){}

    startLoader(){
        
        const hgltTranslationWord = document.getElementById("hglt-translation-word");
        const hgltMeaningDefinition= document.getElementById("hglt-meaning-definition");
        const hgltImage = document.getElementById("hglt-image");
        const hgltImageLoader = document.getElementById("hglt-image-loader");
        const hgltAddStore = document.getElementById("hglt-add-store");
    
        const arrows = document.getElementsByClassName("hglt-arrow");
    
        [...arrows].forEach(arrow => {
            arrow.style.display = 'none';
        });
        hgltImage.style.display = 'none';
        hgltImageLoader.style.display = 'inline-block';
        hgltAddStore.style.display = 'none';
        
        
        
        var count = 0;
        
        setInterval(() => {
            (count < 4)?count++:count = 1;
    
            hgltTranslationWord.innerText = Array(count).fill(".").join(" ");
            hgltMeaningDefinition.innerText = Array(4-count).fill(".").join(" ");
        }, 900);
    
    }
}


