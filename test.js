var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 112; // target width
canvas.height = 150; // target height

var image = new Image();

image.onload = function (e) {
    ctx.drawImage(image,
        0, 0, image.width, image.height,
        0, 0, canvas.width, canvas.height
    );
    // create a new base64 encoding
    var resampledImage = new Image();
    resampledImage.src = canvas.toDataURL();
    console.log("-----------------------");
    console.log(canvas.toDataURL().length);
    console.log("-----------------------");
};


var src = "data:image/jpeg;base64,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";

console.log("/////////////////////////////////////");
console.log(src.length);
console.log("/////////////////////////////////////");


image.src = src;

// 8,192 