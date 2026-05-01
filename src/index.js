// import "./style.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
import {
  boardData,
  chooseShip,
  createBoard,
  interactWithBoard,
  isAllPlace,
} from "./UI components/board.js";
import { twoPlayer } from "./UI components/playGame.js";

let player1 = new Player("Player1", new Gameboard(10, 10));
let player2 = new Player("player2", new Gameboard(10, 10));

createBoard(player1, "#699BF7", true);
chooseShip(player1);
interactWithBoard(player1);

const observerObj1 = (mutationList) => {
  console.log(mutationList);

  boardData(player1)
    //after place player1 come to player 2
    .shipguide.querySelector(".battle__btn")
    .addEventListener("click", (e) => {
      document.querySelector(".container").innerHTML = "";
      createBoard(player2, "#FF8577", true);
      chooseShip(player2);
      interactWithBoard(player2);
      gameObserver2.observe(boardData(player2).shipguide, {
        attribute: true,
        childList: true,
        subtree: false,
      });
    });
};

const observerObj2 = (mutationList) => {
  console.log(mutationList);

  boardData(player2)
    //after place player1 come to player 2
    .shipguide.querySelector(".battle__btn")
    .addEventListener("click", (e) => {
      twoPlayer(player1, player2);
    });
};

const gameObserver1 = new MutationObserver(observerObj1);

const gameObserver2 = new MutationObserver(observerObj2);

gameObserver1.observe(boardData(player1).shipguide, {
  attribute: true,
  childList: true,
  subtree: false,
});

// createBoard(playerBoard2, "yellow", true);
// chooseShip(playerBoard2);
// interactWithBoard(playerBoard2);
