import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { nanoid } from "nanoid";

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    default: nanoid,
  })
  _id!: string;

  @Prop({
    required: true,
    unique: true,
  })
  email!: string;

  @Prop({
    required: true,
  })
  hashedPassword!: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
