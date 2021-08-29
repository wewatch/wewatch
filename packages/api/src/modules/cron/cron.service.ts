/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Model } from "mongoose";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { memberActions as actions } from "@/actions/member";
import { CLIENT_PING_INTERVAL, UserType } from "@/constants";
import { Member, MemberDocument } from "modules/room";
import { User, UserDocument } from "modules/user";
import { InternalEvent, MemberActionEventData } from "utils/types";

const DAY_AS_MILLISECONDS = 24 * 60 * 60 * 1000;

const log = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const original = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const logger = (this as any).logger as PinoLogger;
    const jobName = `cron:${propertyKey}`;
    const startTimestamp = Date.now();

    try {
      await original.apply(this, args);
    } catch (err) {
      logger.error(err, `An error occurred when running ${jobName}.`);
    } finally {
      const endTimestamp = Date.now();
      const responseTime = endTimestamp - startTimestamp;

      logger.info(
        {
          responseTime,
        },
        `${jobName} ran successfully.`,
      );
    }
  };

  return descriptor;
};

@Injectable()
export class CronService {
  constructor(
    @InjectPinoLogger(CronService.name) private readonly logger: PinoLogger,
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron("* * * * *")
  @log
  async cleanUpMembers(): Promise<void> {
    const membersToCleanUp = await this.memberModel
      .find({
        online: true,
        lastPingAt: {
          $lt: new Date(Date.now() - 3 * CLIENT_PING_INTERVAL),
        },
      })
      .exec();

    if (membersToCleanUp.length === 0) {
      return;
    }

    const memberIdsToCleanUp: string[] = membersToCleanUp.map((m) => m._id);
    this.logger.info({ memberIdsToCleanUp }, "Cleaning up members.");

    await this.memberModel
      .updateMany(
        {
          _id: {
            $in: memberIdsToCleanUp,
          },
        },
        {
          $set: {
            online: false,
          },
        },
      )
      .exec();

    for (const member of membersToCleanUp) {
      const eventData: MemberActionEventData = {
        roomId: member.room,
        userId: member.user as string,
        action: actions.leaveRoom(),
      };
      this.eventEmitter.emit(InternalEvent.MemberAction, eventData);
    }
  }

  @Cron("0 0 * * *")
  @log
  async cleanUpVisitors(): Promise<void> {
    const usersToDelete = await this.userModel
      .find({
        type: UserType.Visitor,
        lastActivityAt: {
          $lt: new Date(Date.now() - 3 * DAY_AS_MILLISECONDS),
        },
      })
      .select("_id")
      .exec();

    if (usersToDelete.length === 0) {
      return;
    }

    const userIdsToDelete: string[] = usersToDelete.map((user) => user._id);

    const result = await this.userModel
      .deleteMany({
        _id: {
          $in: userIdsToDelete,
        },
      })
      .exec();

    if (!result.ok) {
      throw new Error("Cannot deleted visitors.");
    }

    this.logger.info(`Deleted ${result.deletedCount} visitors.`);

    await this.memberModel
      .deleteMany({
        user: {
          $in: userIdsToDelete,
        },
      })
      .exec();
  }
}
