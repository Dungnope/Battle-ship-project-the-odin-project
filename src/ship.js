export class Ship {
  constructor(length, x, y) {
    this.length = length;
    this.hits = 0;
    this.x = x;
    this.y = y;
    this.axis = undefined;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits === this.length;
  }
}

//5 ship: carrier: size 5, battleship: size 4,
// destroyer: size 3, submarine: size 3, patrol boat: size 2
