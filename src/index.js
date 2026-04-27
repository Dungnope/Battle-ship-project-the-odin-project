// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import {
  chooseShip,
  createBoard,
  interactWithBoard,
} from "./UI components/board.js";

let playerBoard = new Player("peter", new Gameboard(100, 100));

createBoard(playerBoard);
chooseShip(playerBoard);
interactWithBoard(playerBoard);
