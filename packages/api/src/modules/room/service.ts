import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { nanoid } from "nanoid";

import { Room, RoomDocument } from "./model";

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(): Promise<Room> {
    const room = new this.roomModel({
      playlist: {
        name: nanoid(10),
        videos: [
          {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            title: "Rick Astley - Never Gonna Give You Up (Video)",
            thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
          },
          {
            url: "https://www.youtube.com/watch?v=YuBeBjqKSGQ",
            title:
              "The Magic Flute – Queen of the Night aria (Mozart; Diana Damrau, The Royal Opera)",
            thumbnailUrl: "https://i.ytimg.com/vi/YuBeBjqKSGQ/hqdefault.jpg",
          },
        ],
      },
    });

    return await room.save();
  }

  async get(id: string): Promise<Room | null> {
    return this.roomModel.findById(id).exec();
  }
}
