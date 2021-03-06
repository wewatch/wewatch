import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { UserType } from "@/constants";
import { BaseSchema } from "utils/base-schema";

@Schema({
  timestamps: true,
})
export class User extends BaseSchema {
  @Prop({
    required: true,
    type: String,
  })
  type!: UserType;

  @Prop({
    required: true,
  })
  name!: string;

  @Prop()
  email?: string;

  @Prop()
  hashedPassword?: string;

  @Prop({
    unique: true,
  })
  visitorId!: string;

  @Prop({
    type: Date,
    required: true,
    default: () => new Date(),
  })
  lastActivityAt!: Date;
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

UserSchema.index({
  lastActivityAt: 1,
});
