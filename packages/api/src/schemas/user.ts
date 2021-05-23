import * as yup from "yup";

import { withSchema } from "./utils";

export const createUserSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

@withSchema(createUserSchema)
export class CreateUserDTO {
  email!: string;
  password!: string;
}

export const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

@withSchema(loginSchema)
export class LoginDTO {
  email!: string;
  password!: string;
}

export class AccessTokenDTO {
  accessToken!: string;
}
