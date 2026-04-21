// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { createBoard, interactBoard } from "./UI components/board.js";

let playerBoard = new Player("British", new Gameboard());
let playerBoard2 = new Player("British", new Gameboard(6, 6));

createBoard(playerBoard);
// createBoard(playerBoard2);
