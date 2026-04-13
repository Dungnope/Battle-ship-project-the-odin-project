export class Gameboard {
  constructor(row, column) {
    this.row = row; //for board drawing
    this.column = column; //for board drawing
    this.board = new Array(this.row)
      .fill()
      .map(() => Array(this.column).fill(0));
    this.missedAttacks = 0;
  }

  placeShip(ship, x, y, horizontal = true) {
    //to work with array
    x -= 1;
    y -= 1;
    if (x > this.board.length && horizontal) return "out of board";

    if (this.board[x].length >= ship.length + y) {
      //to create the position and lenght for a ship
      for (let i = 0; i < ship.length; i++) {
        this.board[x][y + i] = 1;
      }
    } else return "out of board";
  }
  receiveAttack(ship, x, y) {
    if (ship.x === x && ship.y === y) {
      ship.hit();
    } else {
      this.missedAttacks++;
    }
  }
}
