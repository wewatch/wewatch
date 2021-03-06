import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { UserDocument } from "modules/user";
import { BaseSchema } from "utils/base-schema";

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

  @Prop({
    required: true,
    default: false,
  })
  readyToNext!: boolean;

  @Prop({
    type: Date,
    required: true,
    default: () => new Date(),
  })
  lastPingAt!: Date;
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

MemberSchema.index({
  user: 1,
});

MemberSchema.index({
  online: 1,
  lastPingAt: 1,
});
