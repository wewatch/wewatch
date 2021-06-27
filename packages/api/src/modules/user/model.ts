import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { nanoid } from "nanoid";

import { constants } from "@wewatch/schemas";

@Schema({
  timestamps: true,
})
export class User {
  id!: string;

  @Prop({
    default: nanoid,
  })
  _id!: string;

  @Prop({
    required: true,
    type: String,
  })
  type!: constants.UserType;

  @Prop({
    required: true,
  })
  name!: string;

  @Prop()
  email!: string;

  @Prop()
  hashedPassword!: string;

  @Prop({
    unique: true,
  })
  visitorId!: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      email: {
        $exists: true,
      },
    },
  },
);
