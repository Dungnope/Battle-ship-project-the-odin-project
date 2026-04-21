// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { createBoard, interactBoard } from "./UI components/board.js";

let playerBoard = new Player("British", new Gameboard(10, 10));
let playerBoard2 = new Player("British34", new Gameboard(10, 10));

createBoard(playerBoard);
createBoard(playerBoard2);

interactBoard(playerBoard);
interactBoard(playerBoard2);
