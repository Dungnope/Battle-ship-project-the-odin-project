// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { createBoard, interactBoard } from "./UI components/board.js";

let playerBoard = new Player("British", new Gameboard());

createBoard(playerBoard);
