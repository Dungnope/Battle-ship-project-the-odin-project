// import "./style.css";
import { Bot, Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  chooseShip,
  createBoard,
  interactWithBoard,
  renderShip,
} from "./UI components/board.js";
import { botPlayGame, playerSetup } from "./UI components/gameplay.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let player1 = new Player("Parker", new Gameboard(10, 10));
  playerSetup(player1);
});
