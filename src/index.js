import "./style.css";
import { Bot, Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  chooseShip,
  createBoard,
  interactWithBoard,
} from "./UI components/board.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let player1 = new Player("Parker", new Gameboard(10, 10));
  let bot1 = new Bot("Parker", new Gameboard(10, 10));
  createBoard(player1, "var(--player-background)", true);
  chooseShip(player1);
  interactWithBoard(player1);
  console.log(bot1.constructor.name);
});
