import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { BaseSchema } from "utils/baseSchema";

@Schema({ _id: false })
class Video {
  @Prop({ required: true })
  url!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  thumbnailUrl!: string;
}

type VideoDocument = Video & Document;
const VideoSchema = SchemaFactory.createForClass(Video);

@Schema({
  timestamps: true,
})
class Playlist extends BaseSchema {
  @Prop({ required: true })
  name!: string;

  @Prop({
    required: true,
    type: [VideoSchema],
    default: [],
  })
  videos!: VideoDocument[];
}

type PlaylistDocument = Playlist & Document;
const PlaylistSchema = SchemaFactory.createForClass(Playlist);

@Schema({
  timestamps: true,
})
export class Room extends BaseSchema {
  @Prop({
    required: true,
    type: PlaylistSchema,
  })
  playlist!: PlaylistDocument;
}

export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);
