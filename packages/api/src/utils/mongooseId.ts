import { SchemaMetadata } from "@nestjs/mongoose/dist/metadata/schema-metadata.interface";
import { Document, Schema } from "mongoose";

export default function <T extends Document>(
  schema: Schema & SchemaMetadata,
): void {
  const transform = function (doc: T, ret: T) {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  };

  schema.options = schema?.options ?? {};
  schema.options.toJSON = schema?.options?.toJSON ?? {};
  schema.options.toJSON.transform = transform;
  schema.set("toJSON", schema.options.toJSON);

  schema.options.toObject = schema.options.toObject || {};
  schema.options.toObject.transform = transform;
  schema.set("toObject", schema.options.toObject);
}
