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
