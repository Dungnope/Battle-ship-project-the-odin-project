// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  chooseShip,
  createBoard,
  interactWithBoard,
} from "./UI components/board.js";

let playerBoard = new Player("Player1", new Gameboard(10, 10));
let playerBoard2 = new Player("player2", new Gameboard(10, 10));

createBoard(playerBoard, "red", true);
chooseShip(playerBoard);
interactWithBoard(playerBoard);

// createBoard(playerBoard2, "yellow", true);
// chooseShip(playerBoard2);
// interactWithBoard(playerBoard2);

// while (!playerBoard.isWinner && !playerBoard2.isWinner) {}
