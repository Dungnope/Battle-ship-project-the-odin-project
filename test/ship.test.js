import { Ship } from "../src/ship";

describe("Ship functions", () => {
  let shipTest = new Ship(20);

  test("get hit", () => {
    shipTest.hit();
    expect(shipTest.hits).toEqual(1);
  });

  test("is sunk", () => {
    expect(shipTest.isSunk()).toBe(false);
  });
});
