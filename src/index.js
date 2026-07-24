import "./style.css";

import { fastPlayGameBot, playerSetup, fastPlayGameLocal, gameMenu } from "./UI_components/gameplay.js";

document.addEventListener("DOMContentLoaded", (e) => {
  //fastPlayGameBot(); // play immediately
  //playerSetup("pepter"); //no need name input at screen
  //fastPlayGameLocal(); //play game with two players one device pass
  gameMenu(); //show game menu
});
