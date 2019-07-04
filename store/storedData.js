const content = document.getElementById("content")   

const tbody = document.getElementById("tbody");


const storedData = JSON.parse(localStorage.getItem("hlt")).reverse();

storedData.forEach(e=>{
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const img = document.createElement("img");
    img.src = e.image
    img.style.maxHeight = "200px"
    td3.appendChild(img)
    const td4 = document.createElement("td");

    td1.innerHTML = e.selection;
    td2.innerHTML = e.translation;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    tbody.appendChild(tr);

})
