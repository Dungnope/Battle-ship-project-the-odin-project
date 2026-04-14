import { Gameboard } from "../src/gameboard";
import { Ship } from "../src/ship";

describe("board", () => {
  let newboard;
  beforeEach(() => {
    newboard = new Gameboard(4, 5);
  });

  test("board size", () => {
    expect(newboard.board).toEqual(
      new Array(newboard.row).fill().map(() => Array(newboard.column).fill(0)),
    );
  });

  test("place ship horizontal", () => {
    newboard.placeShip(new Ship(2), 4, 3);
    expect(newboard.board).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
    ]);
  });

  test("place ship vertical", () => {
    newboard.placeShip(new Ship(3), 2, 2, false);
    expect(newboard.board).toEqual([
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ]);
  });

  test("out of board", () => {
    expect(newboard.placeShip(new Ship(4), 4, 3, false)).toBe("out of board");
  });
});
