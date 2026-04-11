import { Ship } from "./ship";

export class Gameboard {
  constructor(row, column) {
    this.shipNumber = 6;
    this.row = row; //for board drawing
    this.column = column; //for board drawing
    this.board = new Array(this.row)
      .fill()
      .map(() => Array(this.column).fill(0));
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

  receiveAttack(ship, x, y) {
    if (ship.x === x && ship.y === y) {
      ship.hit();
    } else {
      this.missedAttacks++;
    }
  }
}
