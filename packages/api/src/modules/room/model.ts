import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { nanoid } from "nanoid";

import { PlaylistDTO } from "@wewatch/schemas";

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
    type: raw({
      name: {
        type: String,
        required: true,
      },
      videos: [
        {
          url: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          thumbnailUrl: {
            type: String,
            required: true,
          },
        },
      ],
    }),
    required: true,
  })
  playlist!: PlaylistDTO;
}

export type RoomDocument = Room & Document;

export const RoomSchema = SchemaFactory.createForClass(Room);
