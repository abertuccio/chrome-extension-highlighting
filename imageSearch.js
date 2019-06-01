let img = "";

let imgs = [...document.querySelectorAll(".rg_ic.rg_i")]

for (let i = 0; i < imgs.length; i++) {
    if (imgs[i].src) {
        img = imgs[i].src;
        break;
    }
}

