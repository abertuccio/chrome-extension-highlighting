const content = document.getElementById("content")

const tbody = document.getElementById("tbody");



chrome.storage.local.get({ 'hgltStoredElement': [] }, (result) => {

    const storedData = result.hgltStoredElement.reverse();

    //     definitions: (3) ["quick to notice any unusual and potentially dangerous or difficult circumstances; vigilant.", "the state of being watchful for possible danger.", "warn (someone) of a danger, threat, or problem, ty…the intention of having it avoided or dealt with."]
    // image: "https://www.talkwalker.com/assets/frontend/media/pop-up-alert.png"
    // search: "alert"
    // translations: (11) ["alerta", "alerta", "despierto", "vigilante", "atento a", "activo", "zafado", "alerta", "alarma", "alertar", "avisar"]

    storedData.forEach((e,elementIndex )=> {
        const emptyTr = document.createElement("tr");
        const emptyTd = document.createElement("td");
        emptyTd.setAttribute("colspan","5");
        emptyTr.appendChild(emptyTd);
        tbody.appendChild(emptyTr);

        const tr = document.createElement("tr");
        const selection = document.createElement("td");
        // const pronunciation = document.createElement("td");
        const translation = document.createElement("td");
        const definition = document.createElement("td");
        const image = document.createElement("td");
        const actions = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.classList.add("btn","btn-danger");
        removeButton.innerText = "Remove";
        actions.appendChild(removeButton);

        removeButton.addEventListener("click", ()=>{
            storedData.splice(elementIndex,1);
            const newData = storedData.reverse();
            chrome.storage.local.set({ 'hgltStoredElement': newData }, (res)=>{
                window.location = window.location;
               });
        })


        selection.id = "selection";
        // pronunciation.id = "pronunciation";
        translation.id = "translation";
        definition.id = "definition";
        image.id = "image";
        actions.id = "actions";


        selection.innerHTML = e.search;
        // pronunciation.innerHTML = "pronunciation";
        e.translations.forEach((t, i) => {
            if (i < 7) {
                translation.innerHTML += t + "<hr>";
            }
        })
        // translation.innerHTML = e.translations.join("<hr>");
        definition.innerHTML = e.definitions.join("<hr>");
        const img = document.createElement("img");
        img.src = e.image;
        image.appendChild(img)

        tr.appendChild(selection);
        // tr.appendChild(pronunciation);
        tr.appendChild(translation);
        tr.appendChild(definition);
        tr.appendChild(image);
        tr.appendChild(actions);

        tbody.appendChild(tr);
    })

});


