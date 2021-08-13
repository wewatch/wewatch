import { HttpException } from "@nestjs/common";

import { MemberActionDTO } from "@/actions/member";
import { RoomActionDTO } from "@/actions/room";
import { UserDocument } from "modules/user";

export const isHttpException = (e: Error): e is HttpException => {
  return (
    Object.getPrototypeOf(Object.getPrototypeOf(e)).constructor.name ===
    "HttpException"
  );
};

export enum InternalEvent {
  RoomAction = "roomAction",
  MemberAction = "memberAction",
}

export interface RoomActionEventData {
  roomId: string;
  action: RoomActionDTO;
}

export interface MemberActionEventData {
  roomId: string;
  user: UserDocument;
  action: MemberActionDTO;
}
