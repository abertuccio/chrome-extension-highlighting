let originalData = JSON.parse(localStorage.getItem("hlt"));
let cardContainer = document.getElementById("card");


if (originalData && originalData.length) {

    let storedData = originalData.map((e, i) => {
        originalData[i].originalIndex = i;
        if (!('nextPracticeDate' in e)) {
            originalData[i].nextPracticeDate = 0;
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
        const answerImage = document.createElement("img");
        const answerText = document.createElement("div");

        answer.appendChild(answerImage);
        answer.appendChild(answerText);
        card.appendChild(question);
        card.appendChild(answer);

        question.innerText = e.selection;
        question.classList.add("card-element");        
        question.setAttribute("id", i);
        answerImage.src = e.image;
        answerText.innerText = e.translation;


        return card;

    });

    if (cards.length) {
        document.getElementById("rates").style.display = 'block';
        cardContainer.appendChild(cards[0]);
    }

    [...document.getElementsByClassName("rate")].forEach(r => {

        r.addEventListener('click', (e) => {
            showImage(e.target.id);
        });
    })

    const showImage = (rate) => {

        const currentIndex = document.getElementsByClassName("card-element")[0].id;

        const nextIndex = +currentIndex + 1;


        cardContainer.innerHTML = "";
        if (nextIndex <= cards.length - 1) {
            cardContainer.appendChild(cards[nextIndex]);
        } else {
            document.getElementById("rates").style.display = 'none';
            cardContainer.innerText = "Felecitaciones, por hoy terminamos"
        }

    }


}else{
    cardContainer.innerText = "No hay elementos para estudiar.";
    document.getElementById("rates").style.display = 'none';
}
