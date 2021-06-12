import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { BaseSchema } from "utils/baseSchema";

@Schema()
class Video extends BaseSchema {
  @Prop({ required: true })
  url!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  thumbnailUrl!: string;
}

export type VideoDocument = Video & Document;
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
  videos!: Types.DocumentArray<VideoDocument>;
}

export type PlaylistDocument = Playlist & Document;
const PlaylistSchema = SchemaFactory.createForClass(Playlist);

@Schema({
  timestamps: true,
})
export class Room extends BaseSchema {
  @Prop({
    required: true,
    type: [PlaylistSchema],
  })
  playlists!: Types.DocumentArray<PlaylistDocument>;
}

export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);
