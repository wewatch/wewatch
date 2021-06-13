import type { Room } from "@wewatch/schemas";
import { RoomState } from "features/room/slice";

import { useAppSelector } from "./redux";

export const useRoom = (): Room => useAppSelector((state) => state.room.data);

export const useRoomState = (): RoomState =>
  useAppSelector((state) => state.room.state);
