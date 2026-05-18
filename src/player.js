import { Ship } from "./ship.js";

export class Player {
  constructor(name, gameboard) {
    this.isWinner = false;
    this.gameboard = gameboard;
    this.nameTag = name;
  }

  autoPlaceShip(ship) {
    let x = Math.round(Math.random() * (this.gameboard.row - 1));
    let y = Math.round(Math.random() * (this.gameboard.row - 1));
    let axis = Math.round(Math.random());
    while (!this.gameboard.placeShip(ship, x, y, axis)) {
      x = Math.round(Math.random() * (this.gameboard.row - 1));
      y = Math.round(Math.random() * (this.gameboard.row - 1));
    }
  }

  arrangeAllShip() {
    let tempList = [
      new Ship(5), //carrier
      new Ship(4), //battle ship
      new Ship(3), //destroyer
      new Ship(3), //submarine
      new Ship(2), //patrol
    ];

    while (tempList.length) {
      let currentShip = tempList.shift();
      this.autoPlaceShip(currentShip);
    }
  }
}

export class Bot extends Player {
  constructor(name, gameboard) {
    super(name, gameboard);
    this.botShip = [
      new Ship(5), //carrier
      new Ship(4), //battle ship
      new Ship(3), //destroyer
      new Ship(3), //submarine
      new Ship(2), //patrol
    ];
  }

  autoPlaceShip(ship) {
    let x = Math.round(Math.random() * (this.gameboard.row - 1));
    let y = Math.round(Math.random() * (this.gameboard.row - 1));
    let axis = Math.round(Math.random());
    while (!this.gameboard.placeShip(ship, x, y, axis)) {
      x = Math.round(Math.random() * (this.gameboard.row - 1));
      y = Math.round(Math.random() * (this.gameboard.row - 1));
    }
  }

  arrangeAllShip() {
    while (this.botShip.length) {
      let currentShip = this.botShip.shift();
      this.autoPlaceShip(currentShip);
    }
  }
}
