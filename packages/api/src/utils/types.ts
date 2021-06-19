import { HttpException } from "@nestjs/common";

export const isHttpException = (e: Error): e is HttpException => {
  return (
    Object.getPrototypeOf(Object.getPrototypeOf(e)).constructor.name ===
    "HttpException"
  );
};
