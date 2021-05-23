import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { nanoid } from "nanoid";

@Schema({
  timestamps: true,
})
export class Room {
  id!: string;

  @Prop({
    default: nanoid,
  })
  _id!: string;

  @Prop({
    type: [String],
    required: true,
  })
  urls!: string[];
}

export type RoomDocument = Room & Document;

export const RoomSchema = SchemaFactory.createForClass(Room);
