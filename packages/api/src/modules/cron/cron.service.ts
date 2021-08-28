import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Model } from "mongoose";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

import { memberActions as actions } from "@/actions/member";
import { CLIENT_PING_INTERVAL } from "@/constants";
import { Member, MemberDocument } from "modules/room";
import { InternalEvent, MemberActionEventData } from "utils/types";

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
      logger.error(err, `An error occurred when running ${jobName}`);
    } finally {
      const endTimestamp = Date.now();
      const responseTime = endTimestamp - startTimestamp;

      logger.info(
        {
          responseTime,
        },
        `${jobName} ran successfully`,
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

    await this.memberModel
      .updateMany(
        {
          _id: {
            $in: membersToCleanUp.map((m) => m.id),
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
}
