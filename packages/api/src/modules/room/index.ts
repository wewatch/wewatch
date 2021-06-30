import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "modules/user";

import { RoomController } from "./controller";
import { RoomGateway } from "./gateway";
import { Member, MemberSchema } from "./models/member";
import { Room, RoomSchema } from "./models/room";
import { RoomService } from "./service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
      {
        name: Member.name,
        schema: MemberSchema,
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
