export class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.x = 0;
    this.y = 0;
    this.horizontal = true;
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
