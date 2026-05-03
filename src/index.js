// import "./style.css";
import { Bot, Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  boardData,
  chooseShip,
  createBoard,
  interactWithBoard,
  isAllPlace,
  renderShip,
} from "./UI components/board.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let bot1 = new Bot("Bot1", new Gameboard(10, 10));
  let player1 = new Player("Parker", new Gameboard(10, 10));
  createBoard(player1, "var(--player-background)", true);

  chooseShip(player1);
  interactWithBoard(player1);
});
