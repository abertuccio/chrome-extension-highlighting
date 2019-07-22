const hashCode = function (string) {
    var hash = 0, i, chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var hashURL = hashCode(window.location.href);
var fullMarkers = [];
var markers = [];
var currentMarker = 0;

var lastPosition = null;

window.addEventListener('contextmenu', function (e) {
    lastPosition = { x: e.pageX, y: e.pageY };
});

const reorderMarkers = () => {
    markers.sort((p, n) => +p.y - n.y);
    [...document.getElementsByClassName("hglt-marker")].forEach(e => {
        markers.forEach((m, i) => {
            if (+e.id === +m.id) {
                e.innerText = i + 1;
            }
        })
    })
}

const removeMarker = (id) => {
    markers = markers.filter(e => +e.id !== +id);    
    chrome.storage.sync.set({ hgltMarkers: fullMarkers.concat(markers) });
    document.getElementById(id).remove();
    reorderMarkers();
}

const addMarker = () => {
    const id = Math.floor(Math.random() * 1000) + 1;
    markers.push({ id: id, x: lastPosition.x, y: lastPosition.y, hashURL: hashURL, url: window.location.href });
    chrome.storage.sync.set({ hgltMarkers: fullMarkers.concat(markers) });
    createMarker(id, lastPosition.x, lastPosition.y);
}

const removeAllMarkers = () => {
    [...document.getElementsByClassName("hglt-marker")].forEach(e => {
        e.remove();
    })
}

const createMarker = (id, x, y) => {
    const marker = document.createElement("div");
    marker.addEventListener("click", (e) => { removeMarker(e.target.id) });
    marker.id = id;
    marker.title = 'Remove this marker';
    marker.classList.add("hglt-marker");
    marker.style.top = y + "px";
    marker.style.left = x + "px";
    document.body.appendChild(marker);
    reorderMarkers();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.target === 'content-marker' && message.action === 'ADD_MARKER') {
        addMarker();
    }
});


chrome.storage.sync.get({ 'hgltMarkers': [] }, (result) => {
    fullMarkers = result.hgltMarkers.filter(m => m.hashURL !== hashURL);
    markers = result.hgltMarkers.filter(m => m.hashURL === hashURL);
    removeAllMarkers();
    markers.forEach(m => {
        createMarker(m.id, m.x, m.y);
    })
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key === 'hgltMarkers') {
            fullMarkers = changes[key].newValue.filter(m => m.hashURL !== hashURL);
            markers = changes[key].newValue.filter(m => m.hashURL === hashURL);
            removeAllMarkers();
            markers.forEach(m => {
                createMarker(m.id, m.x, m.y);
            })
        }
    }
});

chrome.runtime.sendMessage({
    'target': 'settings-background',
    'action': 'ASK_LANG'
}, (langs) => {
    const lang = langs[navigator.language.split("-")[0]];
    [...document.getElementsByClassName("hglt-marker")].forEach(m => {
        m.title = lang.marker.remove_this_marker;
    })
});

document.addEventListener("keydown", function (keyEvent) {
    if (keyEvent.ctrlKey && keyEvent.altKey && keyEvent.key === "m") {
        if (markers.length) {
            currentMarker++;
            if(currentMarker === markers.length || !markers[currentMarker]){
                currentMarker = 0; 
            }

            const currMarker = document.getElementById(markers[currentMarker].id);
            currMarker.classList.add("hglt-stored-selection-blink");
            
            window.scrollTo(0, markers[currentMarker].y - 100);

                setTimeout(()=>{
                    currMarker.classList.remove("hglt-stored-selection-blink");
                },400);
        }
    }
});