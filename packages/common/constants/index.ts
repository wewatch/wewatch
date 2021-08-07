import { buildLexoRank, NumeralSystem64 } from "@wewatch/lexorank";

export class LexoRank extends buildLexoRank({
  NumeralSystem: NumeralSystem64,
  maxOrder: 8,
  initialMinDecimal: "1000",
  defaultGap: "1000000",
}) {}

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

export enum SupportedProvider {
  YouTube = "YouTube",
  SoundCloud = "SoundCloud",
}
