import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";
import { FilterQuery, Model } from "mongoose";
import { nanoid } from "nanoid";

import {
  MemberActionDTO as ActionDTO,
  memberActions as actions,
  WrappedMemberActionDTO,
  wrappedMemberActionSchema,
} from "@/actions/member";
import { MemberDTO } from "@/schemas/member";
import { InternalEvent, MemberActionEventData } from "utils/types";

import { UserDocument, UserService } from "../user";
import { Member, MemberDocument } from "./member.model";
import { RoomService } from "./room.service";

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @Inject(forwardRef(() => RoomService)) private roomService: RoomService,
    private userService: UserService,
    private schedulerRegistry: SchedulerRegistry,
    private eventEmitter: EventEmitter2,
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

  async handlePing(roomId: string, user: UserDocument): Promise<void> {
    await this.memberModel
      .findOneAndUpdate(
        {
          room: roomId,
          user: user.id,
        },
        {
          lastPingAt: new Date(),
        },
      )
      .exec();

    await this.userService.handlePing(user.id);
  }

  async handleAction(
    roomId: string,
    user: UserDocument,
    action: ActionDTO,
  ): Promise<ActionDTO> {
    if (actions.joinRoom.match(action)) {
      await this.handleJoinRoom(roomId, user);
    } else if (actions.leaveRoom.match(action)) {
      await this.handleLeaveRoom(roomId, user);
    } else if (actions.readyToNext.match(action)) {
      await this.handleReadyToNext(roomId, user);
    }

    return action;
  }

  wrapAction(action: ActionDTO, userId: string): WrappedMemberActionDTO | null {
    if (actions.readyToNext.match(action)) {
      return null;
    }

    return wrappedMemberActionSchema.cast(
      {
        userId,
        action,
        timestamp: Date.now(),
      },
      { stripUnknown: true },
    ) as WrappedMemberActionDTO;
  }

  async handleJoinRoom(roomId: string, user: UserDocument): Promise<void> {
    const room = await this.roomService.getRoom(roomId);
    await this.memberModel
      .findOneAndUpdate(
        {
          room: room.id,
          user: user.id,
        },
        {
          online: true,
          lastPingAt: new Date(),
          $setOnInsert: {
            _id: nanoid(),
          },
        },
        {
          upsert: true,
        },
      )
      .exec();

    const eventData: MemberActionEventData = {
      roomId,
      userId: user.id,
      action: actions.joinRoom(user),
    };
    this.eventEmitter.emit(InternalEvent.MemberAction, eventData);
  }

  async handleLeaveRoom(roomId: string, user: UserDocument): Promise<void> {
    await this.memberModel
      .findOneAndUpdate(
        {
          room: roomId,
          user: user.id,
        },
        {
          online: false,
        },
      )
      .exec();

    const eventData: MemberActionEventData = {
      roomId,
      userId: user.id,
      action: actions.leaveRoom(),
    };
    this.eventEmitter.emit(InternalEvent.MemberAction, eventData);
  }

  async handleReadyToNext(roomId: string, user: UserDocument): Promise<void> {
    const member = await this.memberModel
      .findOneAndUpdate(
        {
          room: roomId,
          user: user.id,
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
