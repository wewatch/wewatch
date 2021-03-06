import * as yup from "yup";

import { UserType } from "@/constants";

import { withSchema } from "./utils";

export const createUserSchema = yup.object({
  email: yup.string().email().required().trim(),
  password: yup.string().min(8).required(),
});

@withSchema(createUserSchema)
export class CreateUserDTO {
  email!: string;
  password!: string;
}

export const userLoginSchema = yup.object({
  email: yup.string().email().required().trim(),
  password: yup.string().required(),
});

@withSchema(userLoginSchema)
export class UserLoginDTO {
  email!: string;
  password!: string;
}

export const visitorLoginSchema = yup.object({
  visitorId: yup.string().required().trim(),
});

@withSchema(visitorLoginSchema)
export class VisitorLoginDTO {
  visitorId!: string;
}

export class AccessTokenDTO {
  accessToken!: string;
}

export const userInfoSchema = yup.object({
  id: yup.string().required(),
  type: yup.mixed<UserType>().required().oneOf(Object.values(UserType)),
  name: yup.string().required(),
});

@withSchema(userInfoSchema)
export class UserInfoDTO {
  id!: string;
  type!: UserType;
  name!: string;
}

export const updateUserInfoSchema = yup.object({
  name: yup.string().max(32).required(),
});

@withSchema(updateUserInfoSchema)
export class UpdateUserInfoDTO {
  name!: string;
}
