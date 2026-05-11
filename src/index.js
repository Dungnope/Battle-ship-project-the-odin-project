// import "./style.css";
import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";
import {
  botPlayGame,
  fastPlayGame,
  playerSetup,
} from "./UI components/gameplay.js";

document.addEventListener("DOMContentLoaded", (e) => {
  let player1 = new Player("Peter", new Gameboard(10, 10));
  playerSetup(player1);
});
