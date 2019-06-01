let img = "";

let imgs = [...document.querySelectorAll(".rg_ic.rg_i")].reduce((a, c) => {
    if (c.src) { a.push(c.src); } return a;
}, [])

chrome.runtime.sendMessage({images: imgs}, function(response) {
    
  });

console.log(imgs)

