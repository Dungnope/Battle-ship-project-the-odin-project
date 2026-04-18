// import "./style.css";
import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";

let player1 = new Player(new Gameboard(4, 4));
let player2 = new Player(new Gameboard(4, 4));

//place ship for two player
player1.gameboard.placeShip(new Ship(3, 1, 1));
player2.gameboard.placeShip(new Ship(3, 3, 0));

console.log(player1.gameboard.board);
console.log(player2.gameboard.board);

//player1 attack player2
player2.gameboard.receiveAttack(3, 1);
player2.gameboard.receiveAttack(3, 2);
player2.gameboard.receiveAttack(3, 0);

//show player2 board
console.log("\n\n\n\n");
console.log(player2.gameboard.board);
console.log(player2.gameboard.isAllCollapse());
if (player2.gameboard.isAllCollapse()) {
  player1.isWinner = true;
  console.log("\n Player 1 win");
}
