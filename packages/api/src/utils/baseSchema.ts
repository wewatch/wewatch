import { Prop, Schema } from "@nestjs/mongoose";
import { nanoid } from "nanoid";

@Schema()
export class BaseSchema {
  id!: string;

  @Prop({ default: nanoid })
  _id!: string;
}
