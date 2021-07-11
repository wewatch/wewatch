import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { generateUsername } from "utils/misc";

import { User, UserDocument } from "./model";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, password: string): Promise<UserDocument> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const type = "user";

    const user = new this.userModel({
      email,
      hashedPassword,
      type,
      name: generateUsername(type),
    });
    return await user.save();
  }

  async createVisitor(visitorId: string): Promise<UserDocument> {
    const type = "visitor";

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

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user === null) {
      return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.hashedPassword);
    return passwordIsValid ? user : null;
  }

  async findByVisitorId(visitorId: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ visitorId }).exec();
  }
}
