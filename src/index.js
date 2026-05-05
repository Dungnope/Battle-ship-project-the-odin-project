// import "./style.css";
import { Bot, Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  chooseShip,
  createBoard,
  interactWithBoard,
} from "./UI components/board.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let player1 = new Player("Parker", new Gameboard(10, 10));
  createBoard(player1, "var(--attention)", true);
  chooseShip(player1);
  interactWithBoard(player1);
});
