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
    let adjacentPosition = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ]; //all around coordinates of a ship fragment

    //take ship coordinate
    let x = ship.x;
    let y = ship.y;
    //check coordinate out of board
    if (x > this.board.length || y > this.board[x].length)
      return "out of board";

    //place ship horizontal
    if (this.board[x].length >= ship.length + y && horizontal) {
      //to create the position and length for a ship
      let collisionCheck = this.#adjacentShip(
        x,
        y,
        ship.length,
        "horizontal",
        adjacentPosition,
      );
      if (collisionCheck) {
        ship.axis = "horizontal";
        for (let i = 0; i < ship.length; i++) {
          this.board[x][y + i] = 1;
          ship.coordinate.push({ x: x, y: y + i });
        }
        this.shipList.push(ship);
      }
    }

    //place vertical
    else if (this.board.length >= ship.length + x && !horizontal) {
      //to create vertical position and length for a ship
      let collisionCheck = this.#adjacentShip(
        x,
        y,
        ship.length,
        "vertical",
        adjacentPosition,
      );
      if (collisionCheck) {
        ship.axis = "vertical";
        for (let i = 0; i < ship.length; i++) {
          this.board[x + i][y] = 1;
          ship.coordinate.push({ x: x + i, y: y });
        }
        this.shipList.push(ship);
      }
    } else return "out of board";
  }

  #adjacentFromXY = (x, y, position) => {
    return position
      .map((value) => {
        let dx, dy;
        dx = value[0] + x;
        dy = value[1] + y;

        //check whether the out of board
        if (
          dx >= 0 &&
          dx < this.board.length &&
          dy >= 0 &&
          dy < this.board[x].length
        ) {
          return { x: dx, y: dy };
        }
      })
      .filter((value) => {
        return value !== undefined;
      });
  };

  #adjacentShip = (x, y, shipLength, axis, adjacentPosition) => {
    for (let i = 0; i < shipLength; i++) {
      //take all possible around coor
      let aroundCoordinates = null;

      //horizontal
      if (axis === "horizontal" && this.board[x][y + i] !== 1) {
        //take all around positions from the x, y position
        aroundCoordinates = this.#adjacentFromXY(x, y + i, adjacentPosition);
      }
      // vertical
      else if (axis === "vertical" && this.board[x + i][y] !== 1) {
        //take all around positions from the x, y position
        aroundCoordinates = this.#adjacentFromXY(x + i, y, adjacentPosition);
      } else return false;

      while (aroundCoordinates.length) {
        let checkAround = aroundCoordinates.shift();
        if (this.board[checkAround.x][checkAround.y] !== 1) {
          continue;
        } else return false;
      }
    }

    return true;
  };

  receiveAttack(x, y) {
    // check if a ship fragment exist or not
    if (this.board[x][y] === 1) {
      //check what ship contain that coordinate
      for (let i = 0; i < this.shipList.length; i++) {
        let oldhit = this.shipList[i].hits;
        //check specific part contain coordinate
        for (let j = 0; j < this.shipList[i].coordinate.length; j++) {
          if (
            this.shipList[i].coordinate[j].x === x &&
            this.shipList[i].coordinate[j].y === y
          ) {
            this.shipList[i].hit();
            break;
          }
        }
        //change that coordinate to destroyed part
        if (oldhit !== this.shipList[i].hits) {
          this.board[x][y] = 2;
          //check whether a specific ship on board is sunk or not
          if (this.shipList[i].isSunk()) {
            let shipIndex = this.shipList.indexOf(this.shipList[i]);
            this.shipList.splice(shipIndex, 1);
          }
          break;
        }
      }
    } else if (this.board[x][y] === 0) {
      this.board[x][y] = 3;
      this.missedAttacksPos.push([x, y]);
    }
  }

  isAllCollapse() {
    if (!this.shipList.length) {
      return true;
    }
    return false;
  }
}
