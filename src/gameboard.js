import { Ship } from "./ship";

export class Gameboard {
  constructor(ship, width, height) {
    this.shipNumber = 6;
    this.width = width; //for board drawing
    this.height = height; //for board drawing
    this.cell = 30; //for board drawing
    this.missedAttacks = 0;
    this.shipOnBoard = [];
  }

  initShip() {
    for (let i = 0; i < this.shipNumber; i++) {
      if (i < 2) {
        this.shipOnBoard.push(new Ship(2));
      } else if (i < 4 && i >= 2) {
        this.shipOnBoard.push(new Ship(3));
      } else {
        this.shipOnBoard.push(new Ship(4));
      }
    }
  }

  receiveAttack(x, y) {
    if (this.ship.x === x && this.ship.y === y) {
      this.ship.hit();
    } else {
      this.missedAttacks++;
    }
  }
}
