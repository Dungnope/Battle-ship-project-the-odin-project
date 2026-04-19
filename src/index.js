// import "./style.css";
import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { createBoard } from "./UI components/board.js";

let playerBoard = new Player(new Gameboard());
createBoard(playerBoard);

let missShot = `
  <div class = "dot"></div>
`;

let correctShot = `
<svg  xmlns="http://www.w3.org/2000/svg" width="30" height="30"  
fill="#000000" viewBox="2 2 20 20"  
transform="rotate(270)">
<!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free-->
<path d="m7.76 14.83-2.83 2.83 1.41 1.41 2.83-2.83 2.12-2.12.71-.71.71.71 1.41 1.42 3.54 3.53 1.41-1.41-3.53-3.54-1.42-1.41-.71-.71 5.66-5.66-1.41-1.41L12 10.59 6.34 4.93 4.93 6.34 10.59 12l-.71.71z"></path>
</svg>
`;

let controlBoard = document.querySelector(".playerBoard");
console.log(controlBoard);
controlBoard.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("box") &&
    e.target.getAttribute("x") == "2" &&
    e.target.getAttribute("y") == "4" &&
    e.target.innerHTML === ""
  ) {
    e.target.innerHTML += correctShot;
    e.target.classList.add("cross");
    console.log(e.target, "boom");
  }
  if (e.target.classList.contains("box") && e.target.innerHTML === "") {
    e.target.innerHTML += missShot;
    console.log(e.target);
  }
});
