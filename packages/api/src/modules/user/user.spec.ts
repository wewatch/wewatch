import * as faker from "faker";

import { app } from "__tests__/setupTests";
import { InvalidCredentials } from "utils/exceptions";

describe("Test authentication", () => {
  test("User should be able to register", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(8);

    const response = await app
      .inject()
      .post("/users")
      .payload({ email, password });

    expect(response.statusCode).toBe(201);
    expect(response.json().accessToken).toBeDefined();
  });

  test("User should not be able to register with invalid data", async () => {
    const email = faker.internet.userName();
    const password = faker.internet.password(6);

    const response = await app
      .inject()
      .post("/users")
      .payload({ email, password });

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toEqual(
      expect.arrayContaining([
        "email must be a valid email",
        "password must be at least 8 characters",
      ]),
    );
  });

  test("User should not be able to register with duplicated email", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(8);

    let response = await app
      .inject()
      .post("/users")
      .payload({ email, password });

    expect(response.statusCode).toBe(201);

    response = await app.inject().post("/users").payload({ email, password });

    expect(response.statusCode).toBe(400);
    expect(response.json().message).toBe("Email already exists");
  });

  test("User should be able to login", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(8);

    let response = await app
      .inject()
      .post("/users")
      .payload({ email, password });

    expect(response.statusCode).toBe(201);

    response = await app
      .inject()
      .post("/users/login")
      .payload({ email, password });

    expect(response.statusCode).toBe(200);
    expect(response.json().accessToken).toBeDefined();
  });

  test("User should not be able to login with invalid data", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(8);

    const response = await app
      .inject()
      .post("/users/login")
      .payload({ email, password });

    expect(response.statusCode).toBe(401);
    expect(response.json().message).toBe(InvalidCredentials.message);
  });
});
