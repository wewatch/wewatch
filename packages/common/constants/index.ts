import type { Activity } from "@/actions";

export type UserType = "user" | "visitor";
export const UserTypes: UserType[] = ["user", "visitor"];

export enum MemberEventPayload {
  ReadyToNext = "readyToNext",
}

export enum SocketEvent {
  RoomAction = "roomAction",
  MemberAction = "memberAction",
  Sync = "sync",
}

export enum SyncType {
  Progress = "progress",
  Activities = "activities",
}

export interface SyncValues {
  [SyncType.Progress]: number;
  [SyncType.Activities]: Activity[];
}

export type SyncValue = SyncValues[SyncType];

export const DEFAULT_SYNC_VALUE: SyncValues = {
  [SyncType.Progress]: 0,
  [SyncType.Activities]: [],
};

export enum SupportedProvider {
  YouTube = "YouTube",
  SoundCloud = "SoundCloud",
}
