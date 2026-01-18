const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 100);

function drawPicture(ctx, path, ...args) {
    const img = new Image();
    img.onload = function () {
        ctx.drawImage(img, ...args)
    }
    img.src = "/home/erik/GitRepos/Scout/assets/images/cards/45.jpg"
}

drawPicture(ctx, "", 0, 0)