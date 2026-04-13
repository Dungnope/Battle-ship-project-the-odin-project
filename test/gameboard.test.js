import { Gameboard } from "../src/gameboard";
import { Ship } from "../src/ship";

describe("board", () => {
  let newboard = new Gameboard(4, 4);

  test("board size", () => {
    expect(newboard.board).toEqual(
      new Array(newboard.row).fill().map(() => Array(newboard.column).fill(0)),
    );
  });

  test("place ship", () => {
    newboard.placeShip(new Ship(2), 2, 2);
    expect(newboard.board).toEqual([
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });
});
