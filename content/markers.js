var markers = [];

var lastPosition = null;

window.addEventListener('contextmenu', function (e) {
    lastPosition = {x:e.pageX,y:e.pageY};    
});

const reorderMarkers = () => {
    markers.sort((p,n)=>p.y - n.y);
    [...document.getElementsByClassName("hglt-marker")].forEach(e=>{
          markers.forEach((m,i)=>{
              if(e.id === m.id){
                  e.innerText = i + 1;
              }
          })
    })
}

const removeMarker = (id) => {
    markers = markers.filter(e=>e.id !== id);
    document.getElementById(id).remove();
    reorderMarkers();
}

const addMarker = () => {
    const marker = document.createElement("div");
    marker.addEventListener("click", (e)=>{removeMarker(e.target.id)});
    marker.id = Math.floor(Math.random() * 1000) + 1;
    markers.push({id:marker.id, y:lastPosition.y});
    marker.title = 'Remove this marker';
    marker.classList.add("hglt-marker");
    marker.style.top = lastPosition.y + "px";
    marker.style.left = lastPosition.x + "px";
    document.body.appendChild(marker);
    reorderMarkers();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if(message.target === 'content-marker' && message.action === 'ADD_MARKER'){
        addMarker();
    }
});