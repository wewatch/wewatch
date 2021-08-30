import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentials extends HttpException {
  static message = "Invalid Credentials";

  constructor() {
    super(InvalidCredentials.message, HttpStatus.UNAUTHORIZED);
  }
}
