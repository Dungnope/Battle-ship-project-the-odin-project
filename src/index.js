import "./style.css";

import { fastPlayGameBot, main, playerSetup, fastPlayGameLocal } from "./UI_components/gameplay.js";

document.addEventListener("DOMContentLoaded", (e) => {
  //fastPlayGameBot(); // play immediately
  //playerSetup("pepter"); //no need name input at screen
  //main(); // type your name to enter the game
  fastPlayGameLocal(); //play game with two players one device pass
});
