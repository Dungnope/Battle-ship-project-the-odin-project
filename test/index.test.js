import { test1 } from "../src/index.js";

// ============ Little test ==============

describe("test", () => {
  test("can show error", () => {
    expect(test1()).toBe("bye");
  });
});
