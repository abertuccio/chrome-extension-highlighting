const content = document.getElementById("content")

const tbody = document.getElementById("tbody");


const soundButton = '<svg id="hglt-translation-sound" title="Play Sound" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>'


chrome.storage.local.get({ 'hgltStoredElement': [] }, (result) => {

    const storedData = result.hgltStoredElement.reverse();

    // definitions: (3) ["quick to notice any unusual and potentially dangerous or difficult circumstances; vigilant.", "the state of being watchful for possible danger.", "warn (someone) of a danger, threat, or problem, ty…the intention of having it avoided or dealt with."]
    // image: "https://www.talkwalker.com/assets/frontend/media/pop-up-alert.png"
    // search: "alert"
    // translations: (11) ["alerta", "alerta", "despierto", "vigilante", "atento a", "activo", "zafado", "alerta", "alarma", "alertar", "avisar"]
    // positions: {search: front, translations: back, definitions: back, context:back, image: back, }

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
        removeButton.classList.add("btn", "btn-danger");
        removeButton.innerText = "Remove";
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



        for (let prop in cardPosition) {
            const positionSelect = document.createElement("select");
            positionSelect.classList.add("card-position", "form-control");
            const front = document.createElement("option");
            front.selected = (e.positions[prop] === 'front')?true:false;
            front.innerText = 'Front';
            const back = document.createElement("option");
            back.selected = (e.positions[prop] === 'back')?true:false;
            back.innerText = 'Back';
            const hide = document.createElement("option");
            hide.selected = (e.positions[prop] === 'hide')?true:false;
            hide.innerText = 'Hide';
            positionSelect.appendChild(front);
            positionSelect.appendChild(back);
            positionSelect.appendChild(hide);
            cardPosition[prop] = positionSelect;
        }


        selection.innerHTML = "<div class='content-wrapper' >" + selection.innerHTML + "</div>";
        translation.innerHTML = "<div class='content-wrapper' >" + translation.innerHTML + "</div>";
        definition.innerHTML = "<div class='content-wrapper' >" + definition.innerHTML + "</div>";
        context.innerHTML = "<div class='content-wrapper' >" + context.innerHTML + "</div>";

        selection.appendChild(cardPosition.selection);
        translation.appendChild(cardPosition.translation);
        definition.appendChild(cardPosition.definition);
        context.appendChild(cardPosition.context);
        image.appendChild(cardPosition.image);


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


