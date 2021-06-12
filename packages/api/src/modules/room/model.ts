import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { PlaylistDTO, VideoDTO } from "@wewatch/schemas";
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
  videos!: VideoDTO[];
}

const PlaylistSchema = SchemaFactory.createForClass(Playlist);

@Schema({
  timestamps: true,
})
export class Room extends BaseSchema {
  @Prop({
    required: true,
    type: [PlaylistSchema],
  })
  playlists!: PlaylistDTO[];
}

export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);
