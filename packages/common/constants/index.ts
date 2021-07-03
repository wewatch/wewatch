export type UserType = "user" | "visitor";
export const UserTypes: UserType[] = ["user", "visitor"];

export enum MemberEventPayload {
  ReadyToNext = "readyToNext",
}

export enum SocketEvent {
  Actions = "actions",
  Members = "members",
  SyncProgress = "syncProgress",
}
