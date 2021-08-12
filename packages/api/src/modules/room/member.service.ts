import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";
import { FilterQuery, Model } from "mongoose";

import { MemberEventPayload } from "@/constants";
import { MemberDTO } from "@/schemas/member";
import { UserDocument } from "modules/user";

import { Member, MemberDocument } from "./member.model";
import { RoomService } from "./room.service";

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @Inject(forwardRef(() => RoomService)) private roomService: RoomService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async getMembers<B extends boolean>(
    roomId: string,
    populate: B,
    additionalFilter: FilterQuery<MemberDocument> = {},
  ): Promise<
    B extends true ? (MemberDocument & MemberDTO)[] : MemberDocument[]
  > {
    let query = this.memberModel.find({
      room: roomId,
      ...additionalFilter,
    });

    if (populate) {
      query = query.populate("user");
    }

    return (await query.exec()) as never;
  }

  async handleUserJoinRoom(roomId: string, user: UserDocument): Promise<void> {
    const room = await this.roomService.getRoom(roomId);
    await this.memberModel
      .findOneAndUpdate(
        {
          room: room.id,
          user: user.id,
        },
        {
          online: true,
        },
        {
          upsert: true,
        },
      )
      .exec();
  }

  async handleUserLeaveRoom(roomId: string, userId: string): Promise<void> {
    await this.memberModel
      .findOneAndUpdate(
        {
          room: roomId,
          user: userId,
        },
        {
          online: false,
        },
      )
      .exec();
  }

  async handleMemberEvent(
    roomId: string,
    userId: string,
    payload: MemberEventPayload,
  ): Promise<void> {
    if (payload === MemberEventPayload.ReadyToNext) {
      await this.handleMemberReadyToNext(roomId, userId);
    }
  }

  async handleMemberReadyToNext(roomId: string, userId: string): Promise<void> {
    const member = await this.memberModel
      .findOneAndUpdate(
        {
          room: roomId,
          user: userId,
        },
        {
          readyToNext: true,
        },
      )
      .exec();
    if (member === null) {
      return;
    }

    const timeoutName = `selectAndPlayNextVideo:${roomId}`;

    const onlineMembers = await this.getMembers(roomId, false, {
      online: true,
    });
    if (onlineMembers.every((m) => m.readyToNext)) {
      this.deleteTimeout(timeoutName);
      return await this.roomService.selectAndPlayNextVideo(roomId);
    }

    const isFirstReadyMember =
      onlineMembers.filter((m) => m.readyToNext).length === 1;
    if (isFirstReadyMember) {
      const timeout = setTimeout(
        this.roomService.selectAndPlayNextVideo.bind(this.roomService),
        5000,
        roomId,
      );

      this.deleteTimeout(timeoutName);
      this.schedulerRegistry.addTimeout(timeoutName, timeout);
    }
  }

  private deleteTimeout(timeoutName: string): void {
    if (this.schedulerRegistry.doesExists("timeout", timeoutName)) {
      this.schedulerRegistry.deleteTimeout(timeoutName);
    }
  }
}
