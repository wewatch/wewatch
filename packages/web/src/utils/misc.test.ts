import { camelToSnake, snakeToCamel, toCamel, toSnake } from "./misc";

it("convert snake_case to camelCase for strings correctly", () => {
  expect(toCamel("hello_world")).toEqual("helloWorld");
  expect(toCamel("helloWorld")).toEqual("helloWorld");
});

it("convert camelCase to snake_case for strings correctly", () => {
  expect(toSnake("helloWorld")).toEqual("hello_world");
  expect(toSnake("hello_world")).toEqual("hello_world");
});

it("convert snake_case to camelCase for objects correctly", () => {
  expect(
    snakeToCamel({
      hello_world: [{ ham_spam: false }, "foo_bar", 1],
    }),
  ).toEqual({
    helloWorld: [{ hamSpam: false }, "foo_bar", 1],
  });
});

it("convert camelCase to snake_case for objects correctly", () => {
  expect(
    camelToSnake({
      helloWorld: [{ hamSpam: false }, "fooBar", 1],
    }),
  ).toEqual({
    hello_world: [{ ham_spam: false }, "fooBar", 1],
  });
});
