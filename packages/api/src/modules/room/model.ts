import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

import { constants } from "@wewatch/schemas";
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
  _id: false,
})
class PlayerState {
  @Prop({
    type: String,
    default: null,
  })
  url!: string | null;

  @Prop({
    required: true,
    default: false,
  })
  playing!: boolean;

  @Prop({
    required: true,
    default: 0,
  })
  played!: number;
}

export type PlayerStateDocument = PlayerState & Document;
const PlayerStateSchema = SchemaFactory.createForClass(PlayerState);

@Schema({
  _id: false,
  timestamps: false,
})
class Member {
  @Prop({
    type: String,
    required: true,
  })
  id!: string;

  @Prop({
    required: true,
    type: String,
  })
  type!: constants.UserType;

  @Prop({
    required: true,
  })
  name!: string;

  @Prop({
    required: true,
  })
  isOnline!: boolean;
}

export type MemberDocument = Member & Document;
const MemberSchema = SchemaFactory.createForClass(Member);

@Schema({
  timestamps: true,
})
export class Room extends BaseSchema {
  @Prop({
    required: true,
    type: [PlaylistSchema],
  })
  playlists!: Types.DocumentArray<PlaylistDocument>;

  @Prop({
    type: String,
    default: null,
  })
  activePlaylistId!: string | null;

  @Prop({
    required: true,
    type: PlayerStateSchema,
    default: {},
  })
  playerState!: PlayerStateDocument;

  @Prop({
    required: true,
    type: [MemberSchema],
  })
  members!: Types.DocumentArray<MemberDocument>;
}

export type RoomDocument = Room & Document;
export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({
  "members.isOnline": 1,
});
