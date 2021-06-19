import type { Action } from "@reduxjs/toolkit";
import * as yup from "yup";

type Actions = Record<string, Action>;

const extractActions = (module: Record<string, any>): Actions =>
  Object.keys(module)
    .filter((key) => key.match(/^[a-z]/) && !key.endsWith("PayloadSchema"))
    .reduce((obj: Actions, key: string) => {
      obj[key] = module[key];
      return obj;
    }, {});

type Schemas = Record<string, yup.BaseSchema>;

const extractSchemas = (module: Record<string, any>): Schemas =>
  Object.keys(module)
    .filter((key) => key.endsWith("PayloadSchema"))
    .reduce((obj: Schemas, key: string) => {
      obj[key] = module[key];
      return obj;
    }, {});

export const createActionSchema = (
  module: Record<string, any>,
): yup.BaseSchema => {
  const actions = extractActions(module);
  const schemas = extractSchemas(module);

  let payloadSchema = yup.mixed();
  for (const [key, action] of Object.entries<Action>(actions)) {
    payloadSchema = payloadSchema.when("type", {
      is: action.type,
      then: schemas[`${key}PayloadSchema`],
    });
  }

  return yup.object({
    type: yup.string().required(),
    payload: payloadSchema.required(),
  });
};
