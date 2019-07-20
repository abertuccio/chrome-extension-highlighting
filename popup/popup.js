import { Lang } from '../languages.js';

class Popup {
    constructor() {
        this.more = document.getElementById("more");
        this.image = document.getElementById("image");
        this.translationFromLabel = document.getElementById("translation-from-label");
        this.translationToLabel = document.getElementById("translation-to-label");
        this.pronunciationCheckboxLabel = document.getElementById("pronunciation-checkbox-label");
        this.definitionCheckboxLabel = document.getElementById("definition-checkbox-label");
        this.definitionCheckboxLabelIn = document.getElementById("definition-checkbox-label-in");
        this.highlight = document.getElementById("highlight");
        this.highlightSite = document.getElementById("highlight-site");
        this.checkboxLabelSite = document.getElementById("checkbox-label-site");
        this.storedBadge = document.getElementById("stored-badge");
        this.studyBadge = document.getElementById("study-badge");
        this.definition = document.getElementById("definition");
        this.translation = document.getElementById("translation");
        this.settingsButton = document.getElementById("settings");
        this.settingText = document.getElementById("setting-text");
        this.pronunciation = document.getElementById("pronunciation");
        this.studyElements = document.getElementById("study-elements");
        this.checkboxLabel = document.getElementById("checkbox-label");
        this.settings = document.getElementsByClassName("settings")[0];
        this.buttons = document.getElementsByClassName("buttons");
        this.storedElements = document.getElementById("stored-elements");
        this.definitionTarget = document.getElementById("definition-target");
        this.translationTarget = document.getElementById("translation-target");
        this.translationFromTarget = document.getElementById("translation-from-target");
        this.imageCheckboxLabel = document.getElementById("image-checkbox-label");
        this.definitionCheckboxLabel = document.getElementById("definition-checkbox-label");
        this.translationCheckboxLabel = document.getElementById("translation-checkbox-label");
        this.locals = Lang['en'];
        this.markersSites = [];
        this.settingsData = {
            translation: {
                avalible: true,
                fromLang: 'auto',
                toLang: 'es',
            },
            pronunciation: {
                avalible: true
            },
            definition: {
                avalible: true,
                lang: 'en'
            },
            images: {
                avalible: true
            }
        };
        this.languagesEquivalence = [
            {
                "language": "Español",
                "speechLang": "es-ES",
                "translationLang": "es"
            },
            {
                "language": "English",
                "speechLang": "en-US",
                "translationLang": "en"
            },
            {
                "language": "Deutsch",
                "speechLang": "de-DE",
                "translationLang": "de"
            },
            {
                "language": "Français",
                "speechLang": "fr-FR",
                "translationLang": "fr"

            },
            {
                "language": "Italiano",
                "speechLang": "it-IT",
                "translationLang": "it"
            },
            {
                "language": "Nederlands",
                "speechLang": "nl-NL",
                "translationLang": "nl"
            },
            {
                "language": "Polski",
                "speechLang": "pl-PL",
                "translationLang": "pl"
            },
            {
                "language": "Português",
                "speechLang": "pt-BR",
                "translationLang": "pt"
            }];


        this.getState();
        this.addActions();
    }

    getState() {
        chrome.storage.sync.get({ 'hgltAvailible': false }, (resultAvailable) => {
            chrome.storage.sync.get({ 'hgltGlobalLanguage': navigator.language.split("-")[0] }, (result) => {
                const language = (result.hgltGlobalLanguage in Lang) ? result.hgltGlobalLanguage : 'en';

                this.locals = Lang[language];
                this.setCheckboxState(resultAvailable.hgltAvailible);
                chrome.storage.sync.get({ 'hgltSitesNotAvailables': [] }, (resultSiteAvailable) => {
                    this.setCheckboxSiteState(resultSiteAvailable.hgltSitesNotAvailables);
                    this.changeLanguage();
                });
            });
        });

        chrome.storage.sync.get({ 'hgltMarkers': [] }, (result) => {
            result.hgltMarkers.forEach(m => {
                if (!this.markersSites.includes(m.url)) {
                    this.markersSites.push(m.url);
                }
            })
        });



        chrome.storage.sync.get({ 'hgltSettings': false }, (result) => {

            if (!result.hgltSettings) {
                chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
            } else {
                this.settingsData = result.hgltSettings;
            }
            this.setSettings(this.settingsData);
        });

        chrome.storage.local.get({ 'hgltStoredElement': [] }, (result) => {
            const count = result.hgltStoredElement.length;

            if (count) {
                this.storedBadge.style.display = 'block';
                this.storedBadge.innerText = (+count > 99) ? '+99' : count;
                this.storedBadge.style.width = (+count > 99) ? '21px' : '14px';

                let studyToday = 0;
                let todayInSeconds = Math.floor(Date.now() / 1000);
                result.hgltStoredElement.forEach(e => {

                    if (('nextPracticeDate' in e) && e.nextPracticeDate < todayInSeconds) {
                        studyToday++;
                    }
                });
                if (studyToday) {
                    this.studyBadge.style.display = 'block';
                    this.studyBadge.innerText = (+studyToday > 99) ? '+99' : studyToday;
                    this.studyBadge.style.width = (+studyToday > 99) ? '21px' : '14px';
                } else {
                    this.studyBadge.style.display = 'none';
                }

            }
            else {
                this.storedBadge.style.display = 'none';
                this.studyBadge.style.display = 'none';
            }
        });

    }

    changeLanguage() {
        this.settingText.innerText = this.locals.popup.settings;
        this.translationCheckboxLabel.innerText = this.locals.popup.translate;
        this.translationFromLabel.innerText = this.locals.popup.from;
        this.translationToLabel.innerText = this.locals.popup.to;
        this.pronunciationCheckboxLabel.innerText = this.locals.popup.pronunciation;
        this.definitionCheckboxLabel.innerText = this.locals.popup.definition;
        this.definitionCheckboxLabelIn.innerText = this.locals.popup.in;
        this.imageCheckboxLabel.innerText = this.locals.popup.images;
        this.storedElements.innerText = this.locals.popup.stored_elements;
        this.studyElements.innerText = this.locals.popup.study_elements;
    }

    addActions() {

        this.languagesEquivalence.forEach(l => {
            const option = document.createElement("option");
            option.value = l.translationLang;
            option.innerText = l.language;
            this.definitionTarget.appendChild(option);
            this.translationTarget.appendChild(option.cloneNode(true));
            this.translationFromTarget.appendChild(option.cloneNode(true));
        })



        this.highlight.addEventListener("change", (e) => {
            chrome.storage.sync.set({ hgltAvailible: e.target.checked });
            this.setCheckboxState(e.target.checked);
        });

        this.highlightSite.addEventListener("change", (e) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
                const currentDomain = tab[0].url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1];
                chrome.storage.sync.get({ 'hgltSitesNotAvailables': [] }, (result) => {
                    const sites = result.hgltSitesNotAvailables
                    if (e.target.checked) {
                        const idx = sites.indexOf(currentDomain);
                        if (idx !== -1) {
                            sites.splice(idx, 1);
                        }
                    } else {
                        sites.push(currentDomain);
                    }

                    chrome.storage.sync.set({ hgltSitesNotAvailables: sites });
                });
            });
        });


        this.settingsButton.addEventListener("click", () => {
            this.settings.classList.toggle("hide");
            (this.more.innerText === 'keyboard_arrow_down') ? this.more.innerText = 'keyboard_arrow_up' : more.innerText = 'keyboard_arrow_down';
        });

        this.translation.addEventListener("change", (e) => {
            this.settingsData.translation.avalible = e.target.checked;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.pronunciation.addEventListener("change", (e) => {
            this.settingsData.pronunciation.avalible = e.target.checked;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.translationTarget.addEventListener("change", (e) => {
            //TODO: VER ESTO DE CAMBIARLO CUANDO SEA EL CASO
            // this.settingsData.translation.fromLang = 'auto';
            this.settingsData.translation.toLang = e.target.value;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.translationFromTarget.addEventListener("change", (e) => {
            //TODO: VER ESTO DE CAMBIARLO CUANDO SEA EL CASO
            this.settingsData.translation.fromLang = e.target.value;
            // this.settingsData.translation.toLang = e.target.value;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.definition.addEventListener("change", (e) => {
            this.settingsData.definition.avalible = e.target.checked;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.definitionTarget.addEventListener("change", (e) => {
            this.settingsData.definition.lang = e.target.value;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        this.image.addEventListener("change", (e) => {
            this.settingsData.images.avalible = e.target.checked;
            chrome.storage.sync.set({ 'hgltSettings': this.settingsData });
        });

        //TODO: VER EL TEMA DE ELIMINAR EL ERROR AL LANZAR ESTO
        this.storedElements.addEventListener("click", function () {
            chrome.runtime.sendMessage({ 'target': 'background', 'action': 'SEE_STORED_DATA' }, function (res) {
                console.log(res);
            });
        })
        //TODO: VER EL TEMA DE ELIMINAR EL ERROR AL LANZAR ESTO
        this.studyElements.addEventListener("click", function () {
            chrome.runtime.sendMessage({ 'target': 'background', 'action': 'STUDY_ELEMENTS' }, function (res) {
                console.log(res);
            });
        })

    }

    //TODO: aca hacer funcion de poner los sitios de los marcadores
    setMarkers() {
    }

    setSettings(settings) {
        this.translation.checked = settings.translation.avalible;
        this.pronunciation.checked = settings.pronunciation.avalible;
        this.translationFromTarget.value = settings.translation.fromLang;
        this.translationTarget.value = settings.translation.toLang;
        this.definition.checked = settings.definition.avalible;
        this.definitionTarget.value = settings.definition.lang;
        this.image.checked = settings.images.avalible;
    }

    setCheckboxState(state) {
        this.highlight.checked = state;
        this.checkboxLabel.innerHTML = (state) ? `<b>${this.locals.popup.hglt_activated}</b>` : this.locals.popup.activate_hglt;
        [...this.buttons].forEach(e => {
            (!state) ? e.style.color = '#d2d2d2' : e.style.color = '#666'
        });
        (!state) ? this.highlightSite.setAttribute("disabled", true) : this.highlightSite.removeAttribute("disabled");
    }

    setCheckboxSiteState(sitesNotAvailables) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
            const url = tab[0].url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
            let state = false;
            let currentDomain = tab[0].url;
            //TODO: VER OTRA MANERA PARA PONER EL DISABLED ABSOLUTO
            //PROBLABLEMENTE HAY QUE LEER LAS EXCLUIDAS DEL MANIFIEST
            if (url && url[1] !== 'translate.google.com') {
                currentDomain = (url[1]);
                state = !sitesNotAvailables.includes(currentDomain);
                this.highlightSite.removeAttribute("disabled");
            } else {
                this.highlightSite.setAttribute("disabled", true);
            }
            chrome.browserAction.setBadgeText({ text: (state) ? "" : "off" });
            this.highlightSite.checked = state;
            currentDomain = currentDomain.substr(0, 21 - 1) + (currentDomain.length > 21 ? '&hellip;' : '');
            this.checkboxLabelSite.innerHTML = (state) ? `${this.locals.popup.active_on} <b>${currentDomain}</b>` : `${this.locals.popup.disabled_on} <b>${currentDomain}</b>`;
        });
    }

}

const popup = new Popup();

chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key === 'hgltSettings') {
            popup.setSettings(changes[key].newValue);
        }
        if (key === 'hgltSitesNotAvailables') {
            popup.setCheckboxSiteState(changes[key].newValue)
        }

        if (key === 'hgltGlobalLanguage') {
            const language = (changes[key].newValue in Lang) ? changes[key].newValue : 'en';
            this.locals = Lang[language];
        }
        if (key === 'hgltMarkers') {
            result.hgltMarkers.forEach(m => {
                if (!popup.markersSites.includes(m.url)) {
                    popup.markersSites.push(m.url);
                }
            })
        }

    }

});