import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

export class Player {
  constructor(name, gameboard) {
    this.isWinner = false;
    this.gameboard = gameboard;
    this.nameTag = name;
    this.isDone = false;
  }
}

export class Bot extends Player {
  constructor(name, gameboard) {
    super(name, gameboard);
  }

  autoPlaceShip() {
    let x = Math.round(Math.random() * (this.gameboard.row - 1));
    let y = Math.round(Math.random() * (this.gameboard.row - 1));
    let axis = Math.round(Math.random());
    // while(this.gameboard.placeShip(x, y, axis));
    console.log(x, y, axis);
  }
}

let bot = new Bot("haha", new Gameboard(10, 10));
bot.gameboard.placeShip(new Ship(3), 2, 2);
bot.autoPlaceShip();
