import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { UserDocument } from "modules/user/model";
import { BaseSchema } from "utils/baseSchema";

@Schema({
  timestamps: false,
})
export class Member extends BaseSchema {
  @Prop({
    required: true,
  })
  room!: string;

  @Prop({
    required: true,
    type: String,
    ref: "User",
  })
  user!: UserDocument | string;

  @Prop({
    required: true,
    default: false,
  })
  online!: boolean;
}

export type MemberDocument = Member & Document;
export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.index(
  {
    room: 1,
    user: 1,
  },
  {
    unique: true,
  },
);
