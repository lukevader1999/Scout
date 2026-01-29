const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");

export function drawShowButton(x, y, width=86, height=35) {
    ctx.lineWidth = 3
    ctx.strokeStyle = 'rgba(99, 69, 35, 1)'
    ctx.strokeRect(x, y, width, height)
    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.lineWidth = 15
    ctx.font = "30px sans-serif"
    ctx.fillText("Show", x+5, y+28)
}