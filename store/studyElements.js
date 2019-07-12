import { sm2 } from './sm2.js';
import { Lang } from '../languages.js';

var lang = Lang[(navigator.language.split("-")[0] || 'en')];

let isThereAnyElement = false;
const cardContainer = document.getElementById("card");
const messageNoItems = document.getElementById("no-elements");
const rates = document.getElementById("rates");
const reverseButton = document.getElementById("reverse");
const kindOfWrapper = { selection: "p", translation: "span", definition: "span", context: "span", image: "img" };
const soundButton = '<svg id="hglt-translation-sound" title="Play Sound" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>';
const title = document.getElementById("title");
const questionRemember = document.getElementById("question-remember");
const reverse = document.getElementById("reverse");
const noElements = document.getElementById("no-elements");
const star5Label = document.getElementById("star5-label");
const star4Label = document.getElementById("star4-label");
const star3Label = document.getElementById("star3-label");
const star2Label = document.getElementById("star2-label");
const star1Label = document.getElementById("star1-label");
const star0Label = document.getElementById("star0-label");
const rateText = document.getElementById("rate-text");


const drawNoItems = () => {
    messageNoItems.style.display = 'block';
    rates.style.display = 'none';
    if (isThereAnyElement) { reverseButton.style.display = "block"; }
}

const drawThereAreItems = () => {
    messageNoItems.style.display = 'none';
    reverseButton.style.display = "none";
}


const mainLoad = () => {

    chrome.storage.local.get({ 'hgltStoredElement': [] }, (result) => {

        let originalData = result.hgltStoredElement;

        if (originalData && originalData.length) {

            isThereAnyElement = true;

            let storedData = originalData.map((e, i) => {
                originalData[i].originalIndex = i;
                if (!('nextPracticeDate' in e)) {
                    originalData[i].nextPracticeDate = 0;
                }
                if (!('repetitions' in e)) {
                    originalData[i].repetitions = 0;
                }
                if (!('easinessFactor' in e)) {
                    originalData[i].easinessFactor = 2.5;
                }
                if (!('interval' in e)) {
                    originalData[i].interval = 1;
                }
                if (!('positions' in e)) {
                    originalData[i].positions = {
                        selection: 'front',
                        translation: 'back',
                        definition: 'back',
                        context: 'back',
                        image: 'back'
                    };
                }
                return originalData[i];
            });


            let todayInSeconds = Math.floor(Date.now() / 1000);

            storedData = storedData.filter(e => e.nextPracticeDate < todayInSeconds);

            storedData = storedData.sort((a, b) => { a.nextPracticeDate - b.nextPracticeDate });


            let cards = storedData.map((e, i) => {
                const card = document.createElement("div");
                const question = document.createElement("div");
                const answer = document.createElement("div");

                card.appendChild(question);
                card.appendChild(answer);


                for (let property in e.positions) {

                    var element = document.createElement(kindOfWrapper[property]);

                    const elementCardWapper = document.createElement("div");
                    elementCardWapper.classList.add("card");
                    const elementCardBody = document.createElement("div");
                    elementCardBody.classList.add("card-body");
                    const titleCard = document.createElement("h5");
                    titleCard.classList.add("card-header");
                    titleCard.innerText = lang.study_elements[property];
                    const pCard = document.createElement("p");
                    pCard.classList.add("card-text");
                    pCard.appendChild(element);
                    elementCardBody.appendChild(pCard);
                    elementCardWapper.appendChild(titleCard);
                    elementCardWapper.appendChild(elementCardBody);
                    

                    element.classList.add(property);

                    if (property === 'selection') {

                        element.addEventListener("click", () => {
                            const utterance = new SpeechSynthesisUtterance(e.search);
                            utterance.lang = e.pronunciationLang;
                            speechSynthesis.speak(utterance);
                        })
                    }


                    if (kindOfWrapper[property] === 'p' || kindOfWrapper[property] === 'span') {
                        //TODO: ACOMODAR ESTE TEMA DE LOS NOMBRES
                        var prop = property;
                        if (property === 'definition') prop = 'definitions';
                        if (property === 'selection') prop = 'search';
                        if (property === 'translation') prop = 'translations';
                        element.innerText = e[prop];
                        if (prop === 'search') {
                            element.innerHTML = element.innerText + " " + soundButton;
                        }
                        if (prop === 'translations') {
                            element.innerText = e[prop].join(" | ");
                        }
                        if (prop === 'context') {
                            const reg = new RegExp("(" + e.search + ")", "g");
                            element.innerHTML = e[prop].replace(reg, "<span class='hglt-selected-text'>$1</span>");
                        }
                    }
                    if (kindOfWrapper[property] === 'img') {
                        element.src = e[property];
                    }
                    if (e.positions[property] === 'front') {

                        question.appendChild(element);
                    }
                    else if (e.positions[property] === 'back') {
                        answer.appendChild(elementCardWapper);
                    }
                    else {
                        // console.log(property + " es hide");
                    }
                }

                question.classList.add("question");
                question.setAttribute("id", i);
                answer.classList.add("answer");
                // answerImage.src = e.image;
                // answerText.innerText = e.translations.join(" | ");


                return card;

            });


            if (cards.length) {
                drawThereAreItems();
                cardContainer.appendChild(cards[0]);
                document.getElementsByClassName("question")[0].addEventListener("click", flipCard);
                rates.style.display = 'none';
            } else {
                drawNoItems();
            }

            [...document.getElementsByClassName("rate")].forEach(r => {

                r.addEventListener('click', (e) => {
                    showImage(e.target.value);
                });


            });


            const showImage = (rate) => {

                [...document.getElementsByClassName("rate")].forEach(e => e.checked = false)

                const element = document.getElementsByClassName("question");

                if (!element.length) return;

                const currentIndex = +document.getElementsByClassName("question")[0].id;

                //TODO: ARREGLAR ESTO QUE RATE VIENE UNDEFINED

                // console.log(storedData[currentIndex]);

                const newCard = sm2(storedData[currentIndex], rate);

                originalData.originalIndex = newCard;

                chrome.storage.local.set({ 'hgltStoredElement': originalData }, (res) => {
                    console.log("updated");
                });


                const nextIndex = currentIndex + 1;

                cardContainer.innerHTML = "";
                if (nextIndex <= cards.length - 1) {
                    cardContainer.appendChild(cards[nextIndex]);
                    document.getElementsByClassName("question")[0].addEventListener("click", flipCard);
                    rates.style.display = 'none';
                }
                else {
                    drawNoItems();
                }
            }
        } else {
            drawNoItems();
        }



    });


}

reverseButton.addEventListener("click", () => {


    [...document.getElementsByClassName("rate")].forEach(r => {

        r.removeEventListener('click', (e) => {
            rateText.innerText = "";
            showImage(e.target.value);
        });
    });


    chrome.storage.local.get({ 'hgltStoredElement': [] }, (result) => {
        let originalData = result.hgltStoredElement;

        originalData = originalData.map((e, i) => {

            const newRep = +originalData[i].repetitions - 1;
            const secondsInDay = 60 * 60 * 24;
            const newDay = originalData[i].nextPracticeDate - secondsInDay;

            originalData[i].repetitions = (newRep <= 0) ? 0 : newRep;
            originalData[i].nextPracticeDate = (newDay <= 0) ? 0 : newDay;

            return originalData[i];

        })

        chrome.storage.local.set({ 'hgltStoredElement': originalData }, (res) => {
            mainLoad();
        });

    });


})

const flipCard = () => {

    document.getElementsByClassName("answer")[0].style.display = "block";
    rates.style.display = 'block';
}


mainLoad();


chrome.storage.sync.get({ 'hgltGlobalLanguage': navigator.language.split("-")[0] }, (result) => {
    const language = (result.hgltGlobalLanguage in Lang) ? result.hgltGlobalLanguage : 'en';
    lang = Lang[language];
    changeLanguageText();
});


const changeLanguageText = () => {

    title.innerText = lang.study_elements.title;
    questionRemember.innerText = lang.study_elements.question_remember;
    reverse.innerText = lang.study_elements.reverse;
    noElements.innerText = lang.study_elements.no_elements;
    star5Label.title = lang.study_elements.star5;
    star4Label.title = lang.study_elements.star4;
    star3Label.title = lang.study_elements.star3;
    star2Label.title = lang.study_elements.star2;
    star1Label.title = lang.study_elements.star1;
    star0Label.title = lang.study_elements.star0;

}


[...document.getElementsByClassName("rate-label")].forEach(s => {

    s.addEventListener('mouseover', (e) => {
        rateText.innerText = e.target.title;
    });

    s.addEventListener('mouseleave', (e) => {
        rateText.innerText = "";
    });

});
