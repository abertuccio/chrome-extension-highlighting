
let selectionLocation = {"x":0, "y":0};
let textSelection = "";

const div = document.createElement("div");
const span = document.createElement("span");
const button = document.createElement("button");
button.innerHTML = "Yes";
button.style.marginLeft = "20px";
button.addEventListener("click", function(){
    let newObj = {};
    newObj[textSelection] = "";
            
    if(localStorage.getItem("hlt")){
        let prevValues = JSON.parse(localStorage.getItem("hlt"));
        prevValues.push(newObj);
        let actualValues = JSON.stringify(prevValues)
        localStorage.setItem("hlt") =  actualValues;
    }else{
        localStorage.setItem("hlt") =  JSON.stringify([newObj]);
    }

})

div.appendChild(span)
div.appendChild(button)

div.style.position = "fixed";
div.style['background-color'] = "white";
div.style['box-shadow'] = "3px 3px 4px #AAA";
div.style.padding = "6px";

document.body.appendChild(div);

document.addEventListener("selectionchange",event=>{
    let sel = document.getSelection()
    let selection = sel.toString();
    let position = sel.focusNode.parentElement.getBoundingClientRect();
        
    if(selection.length){
        span.innerHTML = `Add "<b>${selection}</b>" to the store?`;
        div.style.top = (position.y - 36)+"px";
        div.style.left = position.x+"px";
    }else{
        div.style.top = "-100px"; 
    }
    
})

onscroll = function(e){div.style.top = "-100px";}

