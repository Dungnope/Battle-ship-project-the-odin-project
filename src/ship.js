export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.axis = undefined;
    this.coordinate = [];
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits === this.length;
  }
}

//5 ship: carrier: size 5, battleship: size 4,
// destroyer: size 3, submarine: size 3, patrol: size 2
