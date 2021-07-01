import * as yup from "yup";

export interface TypeWithSchema<T = unknown> extends Function {
  schema?: yup.SchemaOf<T>;

  new (...args: never[]): T;
}

export function withSchema<T>(schema: yup.SchemaOf<T>) {
  return function (target: TypeWithSchema<T>): void {
    target.schema = schema;
  };
}

export type EmptyObject = Record<string, never>;
