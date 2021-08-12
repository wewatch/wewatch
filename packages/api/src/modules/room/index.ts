import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserModule } from "modules/user";

import { RoomController } from "./controller";
import { RoomGateway } from "./gateway";
import { Member, MemberSchema } from "./member.model";
import { MemberService } from "./member.service";
import { Room, RoomSchema } from "./room.model";
import { RoomService } from "./room.service";

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
  providers: [RoomService, MemberService, RoomGateway],
  exports: [RoomService, MemberService],
})
export class RoomModule {}

export { RoomService };
