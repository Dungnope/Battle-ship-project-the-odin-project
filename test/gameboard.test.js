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

  test("more ships place", () => {
    let baseBoard = new Gameboard();
    baseBoard.placeShip(new Ship(3), 2, 4, false);
    baseBoard.placeShip(new Ship(2), 2, 1);
    baseBoard.placeShip(new Ship(3), 1, 2);
    expect(baseBoard.board).toEqual([
      [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });

  test("out of board", () => {
    expect(newboard.placeShip(new Ship(4), 4, 3, false)).toBe("out of board");
  });

  test("collision ship", () => {
    newboard.placeShip(new Ship(3), 2, 4, false);
    newboard.placeShip(new Ship(2), 2, 1);
    newboard.placeShip(new Ship(3), 2, 2);
    expect(newboard.board).toEqual([
      [0, 0, 0, 0, 0],
      [1, 1, 0, 1, 0], // 0, 1, 1, 1, 0 last ship if not be overlapped
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ]);
  });
});
