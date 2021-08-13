export type UserType = "user" | "visitor";
export const UserTypes: UserType[] = ["user", "visitor"];

export enum MemberEventPayload {
  ReadyToNext = "readyToNext",
}

export enum SocketEvent {
  RoomAction = "roomAction",
  MemberAction = "memberAction",
  SyncProgress = "syncProgress",
}

export enum SupportedProvider {
  YouTube = "YouTube",
  SoundCloud = "SoundCloud",
}
