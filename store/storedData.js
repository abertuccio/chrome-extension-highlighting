import { Lang } from '../languages.js';

var lang = Lang[(navigator.language.split("-")[0] || 'en')];

const content = document.getElementById("content");
const tbody = document.getElementById("tbody");
const selectionTh = document.getElementById("selection-th");
const translationTh = document.getElementById("translation-th");
const definitionTh = document.getElementById("definition-th");
const contextTh = document.getElementById("context-th");
const imageTh = document.getElementById("image-th");
const actionsTh = document.getElementById("actions-th");
const title = document.getElementById("title");


const soundButton = '<svg id="hglt-translation-sound" title="Play Sound" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>';


chrome.storage.local.get({ 'hgltStoredElement': [] }, (result) => {

    const storedData = result.hgltStoredElement.reverse();

    // definitions: (3) ["quick to notice any unusual and potentially dangerous or difficult circumstances; vigilant.", "the state of being watchful for possible danger.", "warn (someone) of a danger, threat, or problem, ty…the intention of having it avoided or dealt with."]
    // image: "https://www.talkwalker.com/assets/frontend/media/pop-up-alert.png"
    // search: "alert"
    // pronunciationLang: 'en-US'
    // translations: (11) ["alerta", "alerta", "despierto", "vigilante", "atento a", "activo", "zafado", "alerta", "alarma", "alertar", "avisar"]
    // positions: {search: front, translations: back, definitions: back, context:back, image: back, }

    //TODO: FALTA ACCION DE CAMBIAR A FRONT BACK Y HIDE Y REPRODUCIR SONIDO
    //TODO: ESTE ARCHIVO ES UN KILOMBO

    storedData.forEach((e, elementIndex) => {
        if (!('positions' in e)) {
            e.positions = {
                selection: 'front',
                translation: 'back',
                definition: 'back',
                context: 'back',
                image: 'back'
            };
        }
        if (!('pronunciationLang' in e)) {
            e.pronunciationLang = 'en-US';
        }
        const emptyTr = document.createElement("tr");
        const emptyTd = document.createElement("td");
        emptyTd.setAttribute("colspan", "6");
        emptyTr.appendChild(emptyTd);
        tbody.appendChild(emptyTr);

        const tr = document.createElement("tr");
        const selection = document.createElement("td");
        // const pronunciation = document.createElement("td");
        const translation = document.createElement("td");
        const definition = document.createElement("td");
        const context = document.createElement("td");
        const image = document.createElement("td");
        const actions = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.classList.add("btn", "btn-danger", "remove-button");
        removeButton.innerText = lang.stored_elements.remove;
        actions.appendChild(removeButton);

        removeButton.addEventListener("click", () => {
            storedData.splice(elementIndex, 1);
            const newData = storedData.reverse();
            chrome.storage.local.set({ 'hgltStoredElement': newData }, (res) => {
                window.location = window.location;
            });
        })


        selection.id = "selection";
        // pronunciation.id = "pronunciation";
        translation.id = "translation";
        definition.id = "definition";
        context.id = "context"
        image.id = "image";
        actions.id = "actions";

        const soundButtonWrapper = document.createElement("span");
        soundButtonWrapper.innerHTML = soundButton;
        selection.innerHTML = e.search;
        selection.addEventListener("click", () => {
            const utterance = new SpeechSynthesisUtterance(e.search);
            utterance.lang = e.pronunciationLang;
            speechSynthesis.speak(utterance);
        })
        selection.appendChild(soundButtonWrapper);
        // pronunciation.innerHTML = "pronunciation";
        // e.translations.forEach((t, i) => {
        //     if (i < 7) {
        //         translation.innerHTML += t + "<hr>";
        //     }
        // })
        translation.innerHTML = e.translations.join("<hr>");
        definition.innerHTML = e.definitions.join("<hr>");
        if (e.image) {
            const img = document.createElement("img");
            img.src = e.image;
            image.appendChild(img);
        } else {
            image.innerText = "We couldn't download the image";
        }

        if ('context' in e && e.context.length) {
            const reg = new RegExp("(" + e.search + ")", "g");
            context.innerHTML = e.context.replace((reg), "<span class='hglt-selected-text'>$1</span>");
        }

        var cardPosition = {
            selection: null,
            translation: null,
            definition: null,
            context: null,
            image: null
        };

        const changePosition = (selectedElement, property) => {

            let index = selectedElement.target.options.selectedIndex;
            e.positions[property] = selectedElement.target.options[index].value;
            chrome.storage.local.set({ 'hgltStoredElement': storedData.reverse() }, (res) => {
                console.log("storage changes are completed")
            });
        }



        // for (let prop in cardPosition) {
        //     const positionSelect = document.createElement("select");
        //     positionSelect.classList.add("card-position", "form-control");
        //     const front = document.createElement("option");
        //     front.selected = (e.positions[prop] === 'front') ? true : false;
        //     front.innerText = 'Front';
        //     front.value = 'front';
        //     const back = document.createElement("option");
        //     back.selected = (e.positions[prop] === 'back') ? true : false;
        //     back.innerText = 'Back';
        //     back.value = 'back';
        //     const hide = document.createElement("option");
        //     hide.selected = (e.positions[prop] === 'hide') ? true : false;
        //     hide.innerText = 'Hide';
        //     hide.value = 'hide';
        //     positionSelect.appendChild(front);
        //     positionSelect.appendChild(back);
        //     positionSelect.appendChild(hide);
        //     cardPosition[prop] = positionSelect;
        //     positionSelect.addEventListener("change", (elmt) => { changePosition(elmt, prop) })
        // }


        selection.innerHTML = "<div class='content-wrapper' >" + selection.innerHTML + "</div>";
        translation.innerHTML = "<div class='content-wrapper' >" + translation.innerHTML + "</div>";
        definition.innerHTML = "<div class='content-wrapper' >" + definition.innerHTML + "</div>";
        context.innerHTML = "<div class='content-wrapper' >" + context.innerHTML + "</div>";

        // selection.appendChild(cardPosition.selection);
        // translation.appendChild(cardPosition.translation);
        // definition.appendChild(cardPosition.definition);
        // context.appendChild(cardPosition.context);
        // image.appendChild(cardPosition.image);


        tr.appendChild(selection);
        // tr.appendChild(pronunciation);
        tr.appendChild(translation);
        tr.appendChild(definition);
        tr.appendChild(context);
        tr.appendChild(image);
        tr.appendChild(actions);

        tbody.appendChild(tr);
    })

});


chrome.storage.sync.get({ 'hgltGlobalLanguage': navigator.language.split("-")[0] }, (result) => {
    const language = (result.hgltGlobalLanguage in Lang) ? result.hgltGlobalLanguage : 'en';
    lang = Lang[language];
    changeLanguageText();
});


const changeLanguageText = () => {

    title.innerText = lang.stored_elements.title;
    selectionTh.innerText = lang.stored_elements.selection_th;
    translationTh.innerText = lang.stored_elements.translation_th;
    definitionTh.innerText = lang.stored_elements.definition_th;
    contextTh.innerText = lang.stored_elements.context_th;
    imageTh.innerText = lang.stored_elements.image_th;
    actionsTh.innerText = lang.stored_elements.actions_th;

    [...document.getElementsByClassName("btn btn-danger")].forEach(b => {
        b.innerText = lang.stored_elements.remove;
    })
}
