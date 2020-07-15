let width = window.innerWidth;
console.log(width);
let scroll = document.getElementById("scroll");
console.log(scroll);

if(width <= 700) {
    scroll.style.display = "none";
}
