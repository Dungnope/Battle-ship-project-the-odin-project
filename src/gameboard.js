export class Gameboard {
  constructor(row, column) {
    this.row = row === undefined ? 10 : row; //for board drawing
    this.column = column === undefined ? 10 : column; //for board drawing
    this.board = new Array(this.row)
      .fill()
      .map(() => Array(this.column).fill(0));
    this.missedAttacks = 0;
  }

  placeShip(ship, x, y, horizontal = true) {
    //to work with array
    x -= 1;
    y -= 1;

    //check coordinate out of board
    if (x > this.board.length || y > this.board[x].length)
      return "out of board";

    //place ship horizontal
    if (this.board[x].length >= ship.length + y && horizontal) {
      //to create the position and length for a ship
      for (let i = 0; i < ship.length; i++) {
        this.board[x][y + i] = 1;
      }
    }

    //place vertical
    else if (this.board.length >= ship.length + x && !horizontal) {
      //to create vertical position and length for a ship
      for (let i = 0; i < ship.length; i++) {
        this.board[x + i][y] = 1;
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
