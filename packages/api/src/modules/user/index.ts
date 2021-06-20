import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "modules/auth";

import { User, UserSchema } from "./model";
import { UserService } from "./service";
import { UserController } from "./user.controller";
import { VisitorController } from "./visitor.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController, VisitorController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

export { UserService };
