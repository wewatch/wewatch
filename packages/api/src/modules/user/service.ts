import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { generateUsername } from "../../utils/misc";
import { User, UserDocument } from "./model";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(email: string, password: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const type = "user";

    const user = new this.userModel({
      email,
      hashedPassword,
      type,
      name: generateUsername(type),
    });
    return user.save();
  }

  async createVisitor(visitorId: string): Promise<User> {
    const type = "visitor";

    const visitor = new this.userModel({
      visitorId,
      type,
      name: generateUsername(type),
    });
    return visitor.save();
  }

  async get(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user === null) {
      return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.hashedPassword);
    return passwordIsValid ? user : null;
  }

  async findByVisitorId(visitorId: string): Promise<User | null> {
    return this.userModel.findOne({ visitorId }).exec();
  }
}
