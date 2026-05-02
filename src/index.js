// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  boardData,
  chooseShip,
  createBoard,
  interactWithBoard,
  isAllPlace,
} from "./UI components/board.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let player1 = new Player("Player1", new Gameboard(10, 10));
  let player2 = new Player("player2", new Gameboard(10, 10));

  createBoard(player1, "#699BF7", true);
  chooseShip(player1);
  interactWithBoard(player1);
});

// createBoard(playerBoard2, "yellow", true);
// chooseShip(playerBoard2);
// interactWithBoard(playerBoard2);
