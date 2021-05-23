import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RoomController } from "./controller";
import { Room, RoomSchema } from "./model";
import { RoomService } from "./service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}

export { RoomService };