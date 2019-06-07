function sm2(card, quality) {

    if (quality < 0 || quality > 5) {
        console.log("Invalid quality");
    }

    // retrieve the stored values (default values if new cards)
    let repetitions = card.repetitions;
    let easiness = card.easinessFactor;
    let interval = card.interval;

    // easiness factor
    easiness = Math.max(1.3, easiness + 0.1 - (5.0 - quality) * (0.08 + (5.0 - quality) * 0.02));

    // repetitions
    if (quality < 3) {
        repetitions = 0;
    } else {
        repetitions = repetitions + 1;
    }

    // interval
    if (repetitions <= 1) {
        interval = 1;
    } else if (repetitions == 2) {
        interval = 6;
    } else {
        interval = Math.round(interval * easiness);
    }

    // next practice 
    const secondsInDay = 60 * 60 * 24;
    const now = Math.floor(Date.now() / 1000);
    const nextPracticeDate = now + secondsInDay * interval;

    console.log("Next practice in " + ((nextPracticeDate - now) / 60 / 60) + " hours")
    card.repetitions = repetitions;
    card.easinessFactor = easiness;
    card.interval = interval;
    card.nextPracticeDate = nextPracticeDate;
    return card;
}

const testCards = [{
    question: "How old are you?",
    answer: "39",
    repetitions: 0,
    easinessFactor: 2.5,
    interval: 1,
    nextPracticeDate:0
}]


const newCard = sm2(testCards[0], 0)
const newCard2 = sm2(newCard, 2)
const newCard3 = sm2(newCard2, 2)
const newCard4 = sm2(newCard3, 2)
const newCard5 = sm2(newCard4, 3)
const newCard6 = sm2(newCard5, 3)

console.log(newCard6)


// "5 - perfect response"
// "4 - correct response after a hesitation"
// "3 - correct response recalled with serious difficulty"
// "2 - incorrect response; where the correct one seemed easy to recall"
// "1 - incorrect response; the correct one remembered"
// "0 - complete blackout"