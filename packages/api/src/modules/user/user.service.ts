import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { UserType } from "@/constants";
import { UpdateUserInfoDTO } from "@/schemas/user";
import { generateUsername } from "utils/misc";

import { User, UserDocument } from "./user.model";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, password: string): Promise<UserDocument> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const type = UserType.User;

    const user = new this.userModel({
      email,
      hashedPassword,
      type,
      name: generateUsername(type),
    });
    return await user.save();
  }

  async createVisitor(visitorId: string): Promise<UserDocument> {
    const type = UserType.Visitor;

    const visitor = new this.userModel({
      visitorId,
      type,
      name: generateUsername(type),
    });
    return await visitor.save();
  }

  async get(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  async update(
    id: string,
    payload: UpdateUserInfoDTO,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .exec();
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user === null) {
      return null;
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user?.hashedPassword ?? "",
    );
    return passwordIsValid ? user : null;
  }

  async findByVisitorId(visitorId: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ visitorId }).exec();
  }

  async handlePing(userId: string): Promise<void> {
    await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
        },
        {
          lastActivityAt: new Date(),
        },
      )
      .exec();
  }
}
