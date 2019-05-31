
let selectionLocation = {"x":0, "y":0};
onmousemove = function(e){selectionLocation.x = e.clientX; selectionLocation.y = e.clientY;}

const div = document.createElement("div");
const button = document.createElement("button");

div.appendChild(button)

div.style.position = "fixed";
document.body.appendChild(div);

document.addEventListener("selectionchange",event=>{
    let selection = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString() ;
    if(selection.length){
        button.innerHTML = `Agregar "<b>${selection}</b>" ${event.clientX}`;
        div.style.top = selectionLocation.y - 20;
        div.style.left = selectionLocation.x + 30;
    }else{
        div.style.top = -100; 
    }

  })


