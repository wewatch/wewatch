import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "modules/auth";

import { UserController } from "./user.controller";
import { User, UserDocument, UserSchema } from "./user.model";
import { UserService } from "./user.service";
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
  exports: [MongooseModule, UserService],
})
export class UserModule {}

export { UserService, User, UserDocument };
