import { Ship } from "./ship.js";
import carrierShip from "../assets/carrier.svg";
import destroyerShip from "../assets/destroyer.svg";
import battleShip from "../assets/battle_ship.svg";
import patrolShip from "../assets/patrol.svg";
import Submarine from "../assets/submarine.svg";
// import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(name, gameboard) {
    this.isWinner = false;
    this.gameboard = gameboard;
    this.nameTag = name;
  }

  autoPlaceShip(ship, texture) {
    let x = Math.round(Math.random() * (this.gameboard.row - 1));
    let y = Math.round(Math.random() * (this.gameboard.row - 1));
    let axis = Math.round(Math.random());
    while (!this.gameboard.placeShip(ship, x, y, axis)) {
      x = Math.round(Math.random() * (this.gameboard.row - 1));
      y = Math.round(Math.random() * (this.gameboard.row - 1));
    }
    //take last item of ship list
    this.gameboard.shipList.at(-1).texture = texture;
  }

  arrangeAllShip() {
    let tempList = [
      new Ship(5), //carrier
      new Ship(4), //battle ship
      new Ship(3), //destroyer
      new Ship(3), //submarine
      new Ship(2), //patrol
    ];

    let texture = [
      carrierShip,
      battleShip,
      destroyerShip,
      Submarine,
      patrolShip,
    ];

    while (tempList.length) {
      let currentShip = tempList.shift();
      this.autoPlaceShip(currentShip, texture.shift());
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
}
