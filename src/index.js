// import "./style.css";
import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { createBoard } from "./UI components/board.js";

let playerBoard = new Player(new Gameboard());

createBoard(playerBoard);
