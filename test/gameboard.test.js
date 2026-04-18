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
    newboard.placeShip(new Ship(2, 3, 2));
    expect(newboard.board).toEqual([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
    ]);
  });

  test("place ship vertical", () => {
    newboard.placeShip(new Ship(3, 1, 1), false); //ship(lenght, x, y)
    expect(newboard.board).toEqual([
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
    ]);
  });

  test("more ships place", () => {
    let baseBoard = new Gameboard();
    baseBoard.placeShip(new Ship(3, 1, 3), false);
    baseBoard.placeShip(new Ship(2, 1, 0));
    baseBoard.placeShip(new Ship(3, 0, 1));
    expect(baseBoard.board).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
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
    expect(newboard.placeShip(new Ship(4, 3, 2), false)).toBe("out of board");
  });

  test("collision ship", () => {
    newboard.placeShip(new Ship(3, 1, 3), false);
    newboard.placeShip(new Ship(3, 1, 0));
    newboard.placeShip(new Ship(3, 0, 0), false);
    newboard.placeShip(new Ship(3, 1, 1));
    expect(newboard.board).toEqual([
      [1, 0, 0, 0, 0],
      [1, 0, 0, 1, 0], // 0, 1, 1, 1, 0 last ship if not be overlapped
      [1, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
    ]);
  });

  test("adjacent ship", () => {
    newboard.placeShip(new Ship(2, 1, 1));
    newboard.placeShip(new Ship(2, 2, 4), false);
    newboard.placeShip(new Ship(3, 3, 1)); //not show because adjacent ship above
    expect(newboard.board).toEqual([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0], // 0, 1, 1, 1, 0 last ship if not be overlapped
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1], //if not adjacent the last ship at 0, 1, 1, 1, 1
    ]);
  });

  test("more adjacent ship", () => {
    newboard.placeShip(new Ship(2, 1, 1));
    newboard.placeShip(new Ship(2, 0, 4), false);
    newboard.placeShip(new Ship(4, 3, 1)); //not show because adjacent ship above
    newboard.placeShip(new Ship(1, 2, 0)); //not show because adjacent ship above
    expect(newboard.board).toEqual([
      [0, 0, 0, 0, 1],
      [0, 1, 1, 0, 1], // 0, 1, 1, 1, 0 last ship if not be overlapped
      [0, 0, 0, 0, 0], // check diagonal if is valid will show 1, 0, 0, 0, 0 of last ship
      [0, 1, 1, 1, 1], //if not adjacent the last ship at 0, 1, 1, 1, 1
    ]);
  });

  test("diagonal ship", () => {
    newboard.placeShip(new Ship(2, 0, 0));
    newboard.placeShip(new Ship(2, 2, 3));
    newboard.placeShip(new Ship(2, 3, 0));
    expect(newboard.board).toEqual([
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1],
      [1, 1, 0, 0, 0],
    ]);
  });

  test("receive attack", () => {
    newboard.placeShip(new Ship(2, 0, 0));
    newboard.placeShip(new Ship(2, 2, 3));
    newboard.placeShip(new Ship(2, 3, 0));
    newboard.receiveAttack(3, 0);
    newboard.receiveAttack(2, 3);
    newboard.receiveAttack(2, 4);
    expect(newboard.board).toEqual([
      [1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 2, 2],
      [2, 1, 0, 0, 0],
    ]);
  });

  test("more receive attacks", () => {
    let baseBoard = new Gameboard();
    baseBoard.placeShip(new Ship(4, 0, 0));
    baseBoard.placeShip(new Ship(2, 2, 3));
    baseBoard.placeShip(new Ship(2, 3, 0), false);
    baseBoard.receiveAttack(3, 0);
    baseBoard.receiveAttack(2, 3);
    baseBoard.receiveAttack(2, 4);
    baseBoard.receiveAttack(2, 5);
    baseBoard.receiveAttack(0, 2);
    baseBoard.receiveAttack(7, 5);
    expect(baseBoard.board).toEqual([
      [1, 1, 2, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 2, 3, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  });
});
