import "./style.css";

import { fastPlayGame, main, playerSetup } from "./UI_components/gameplay.js";

document.addEventListener("DOMContentLoaded", (e) => {
  fastPlayGame(); // play immediately
  //playerSetup("pepter"); //no need name input at screen
  //main(); // type your name to enter the game
});
