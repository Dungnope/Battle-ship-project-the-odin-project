// import "./style.css";
import { Bot, Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  chooseShip,
  createBoard,
  interactWithBoard,
  renderShip,
} from "./UI components/board.js";
import { botPlayGame } from "./UI components/botplay.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let player1 = new Player("Parker", new Gameboard(10, 10));
  let bot1 = new Bot("Bot1", new Gameboard(10, 10));
  bot1.arrangeAllShip();
  player1.arrangeAllShip();
  createBoard(player1, "var(--attention)", false);
  createBoard(bot1, "greenyellow", false);
  renderShip(player1);
  renderShip(bot1);
  botPlayGame(player1, bot1);
});
