import { createBoard } from "./board.js";

export const twoPlayer = (player1, player2) => {
  document.querySelector(".container").innerHTML = "";
  createBoard(player1, "#699BF7", false);
  createBoard(player2, "#FF8577", false);
  console.log(player1.gameboard, player2.gameboard);
};
