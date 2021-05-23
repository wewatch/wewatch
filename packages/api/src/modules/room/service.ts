import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Room, RoomDocument } from "./model";

@Injectable()
export class RoomService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(): Promise<Room> {
    const room = new this.roomModel({
      urls: [
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "https://www.youtube.com/watch?v=YuBeBjqKSGQ",
      ],
    });
    return await room.save();
  }

  async get(id: string): Promise<Room | null> {
    return this.roomModel.findById(id).exec();
  }
}
