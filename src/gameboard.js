export class Gameboard {
  constructor(row, column) {
    this.row = row === undefined ? 10 : row; //for board drawing
    this.column = column === undefined ? 10 : column; //for board drawing
    this.board = new Array(this.row)
      .fill()
      .map(() => Array(this.column).fill(0));
    this.missedAttacksPos = [];
    this.shipList = [];
  }

  placeShip(ship, horizontal = true) {
    //take ship coordinate
    let x = ship.x;
    let y = ship.y;
    //check coordinate out of board
    if (x > this.board.length || y > this.board[x].length)
      return "out of board";

    //place ship horizontal
    if (this.board[x].length >= ship.length + y && horizontal) {
      //to create the position and length for a ship
      let collisionCheck = this.#adjacentShip(x, y, ship.length, "horizontal");
      if (collisionCheck) {
        for (let i = 0; i < ship.length; i++) {
          this.board[x][y + i] = 1;
        }
        this.shipList.push(ship);
      }
    }

    //place vertical
    else if (this.board.length >= ship.length + x && !horizontal) {
      //to create vertical position and length for a ship
      let collisionCheck = this.#adjacentShip(x, y, ship.length, "vertical");
      if (collisionCheck) {
        for (let i = 0; i < ship.length; i++) {
          this.board[x + i][y] = 1;
        }
        this.shipList.push(ship);
      }
    } else return "out of board";
  }

  #adjacentShip = (x, y, shipLength, axis) => {
    let position = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]; //all around coordinates of a ship fragment

    let adjacentFromXY = (i, axis) => {
      return position
        .map((value) => {
          let dx, dy;
          if (axis === "horizontal") {
            dx = value[0] + x;
            dy = value[1] + y + i;
          } else if (axis === "vertical") {
            dx = value[0] + x + i;
            dy = value[1] + y;
          }

          //check whether the out of board
          if (
            dx >= 0 &&
            dx < this.board.length &&
            dy >= 0 &&
            dy < this.board[x].length
          ) {
            return [dx, dy];
          }
        })
        .filter((value) => {
          return value !== undefined;
        });
    };

    for (let i = 0; i < shipLength; i++) {
      //take all possible around coor
      let aroundCoordinates = null;

      //horizontal
      if (axis === "horizontal" && this.board[x][y + i] !== 1) {
        //take all around positions from the x, y position
        aroundCoordinates = adjacentFromXY(i, axis);
      }
      // vertical
      else if (axis === "vertical" && this.board[x + i][y] !== 1) {
        //take all around positions from the x, y position
        aroundCoordinates = adjacentFromXY(i, axis);
      } else return false;

      while (aroundCoordinates.length) {
        let checkAround = aroundCoordinates.shift();
        let coor = { x: checkAround[0], y: checkAround[1] };
        if (this.board[coor.x][coor.y] !== 1) {
          continue;
        } else return false;
      }
    }

    return true;
  };

  receiveAttack(x, y) {
    this.shipList.forEach((ship) => {
      if (ship.x === x && ship.y === y) {
        ship.hit();
        this.board[x][y] = 2; //ship get hit will show a destroyed part
      } else {
        this.missedAttacksPos.push([x, y]);
      }
    });
  }

  destroyedShip(ship) {
    if (ship.isSunk()) {
    }
  }
}
