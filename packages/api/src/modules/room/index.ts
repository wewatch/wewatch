import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { RateLimitModule } from "modules/rate-limit";
import { UserModule } from "modules/user";

import { RoomController } from "./controller";
import { RoomGateway } from "./gateway";
import { Member, MemberDocument, MemberSchema } from "./member.model";
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
    RateLimitModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, MemberService, RoomGateway],
  exports: [MongooseModule, RoomService, MemberService],
})
export class RoomModule {}

export { RoomService, Member, MemberDocument };
