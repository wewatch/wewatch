import { WrappedMemberActionDTO } from "./member";
import { WrappedRoomActionDTO } from "./room";

export type Activity = WrappedRoomActionDTO | WrappedMemberActionDTO;

export type Activities = Activity[];
