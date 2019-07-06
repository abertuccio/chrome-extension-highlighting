import { sm2 } from './sm2.js';

let isThereAnyElement = false;
const cardContainer = document.getElementById("card");
const messageNoItems = document.getElementById("no-elements");
const rates = document.getElementById("rates");
const reverseButton = document.getElementById("reverse");
const kindOfWrapper = { selection: "p", translation: "p", definition: "p", context: "p", image: "img" };
const soundButton = '<svg id="hglt-translation-sound" title="Play Sound" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>';

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
                if (!('repetition' in e)) {
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

                    // console.log(property);
                    // console.log(e[property]);
                    // console.log(kindOfWrapper[property]);
                    var element = document.createElement(kindOfWrapper[property]);
                    element.classList.add(property);

                    if (property === 'selection') {
                        
                        element.addEventListener("click", () => {
                            const utterance = new SpeechSynthesisUtterance(e.search);
                            utterance.lang = e.pronunciationLang;
                            speechSynthesis.speak(utterance);
                            console.log(utterance);
                        })
                    }


                    if (kindOfWrapper[property] === 'p') {
                        //TODO: ACOMODAR ESTE TEMA DE LOS NOMBRES
                        var prop = property;
                        if (property === 'definition') prop = 'definitions';
                        if (property === 'selection') prop = 'search';
                        if (property === 'translation') prop = 'translations';
                        element.innerText = e[prop];
                        if (prop === 'search') {
                            element.innerHTML = element.innerText + " " + soundButton;
                        }
                    }
                    if (kindOfWrapper[property] === 'img') {
                        element.src = e[property];
                    }
                    if (e.positions[property] === 'front') {

                        question.appendChild(element);
                    }
                    else if (e.positions[property] === 'back') {
                        answer.appendChild(element);
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
                    showImage(e.target.id);
                });
            });

            // [...document.getElementsByClassName("selection")].forEach(s => {
            //     s.addEventListener("click", (e) => {

            //     })
            // })

            const showImage = (rate) => {

                const currentIndex = +document.getElementsByClassName("question")[0].id;

                console.log(storedData[currentIndex]);
                const newCard = sm2(storedData[currentIndex], rate);

                originalData.originalIndex = newCard;

                localStorage.setItem("hlt", JSON.stringify(originalData));


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