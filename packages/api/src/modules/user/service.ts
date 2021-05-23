import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";

import { CreateUserDTO } from "schemas/user";

import { User, UserDocument } from "./model";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDTO.password, salt);

    const user = new this.userModel({
      ...createUserDTO,
      hashedPassword,
    });
    return await user.save();
  }

  async get(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmailAndPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user === null) {
      return null;
    }

    const passwordIsValid = await bcrypt.compare(password, user.hashedPassword);
    return passwordIsValid ? user : null;
  }
}
