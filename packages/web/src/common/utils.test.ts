import { findMinMax } from "./utils";

test("find min and max of an array", () => {
  const stringArray = ["a", "b", "bb", "c"];
  expect(findMinMax(stringArray)).toEqual({ min: "a", max: "c" });

  const numberArray = [2, 3, 5, 8, 13, 21];
  expect(findMinMax(numberArray)).toEqual({ min: 2, max: 21 });
});
