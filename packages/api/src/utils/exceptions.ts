import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentials extends HttpException {
  static message = "Invalid Credentials";

  constructor() {
    super(InvalidCredentials.message, HttpStatus.UNAUTHORIZED);
  }
}

export class TooManyRequests extends HttpException {
  static message = "Too Many Requests";

  constructor() {
    super(TooManyRequests.message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
