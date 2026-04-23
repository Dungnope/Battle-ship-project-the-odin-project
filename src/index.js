// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { createBoard, interactBoard } from "./UI components/board.js";
import { placeShip } from "./UI components/placeship.js";

let playerBoard = new Player("peter", new Gameboard(10, 10));

createBoard(playerBoard);
placeShip(playerBoard);
