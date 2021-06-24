import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "modules/user";

import { RoomController } from "./controller";
import { RoomGateway } from "./gateway";
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
    UserModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
  exports: [RoomService],
})
export class RoomModule {}

export { RoomService };
