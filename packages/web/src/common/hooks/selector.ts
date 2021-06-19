import type { Room } from "@wewatch/schemas";

import { useAppSelector } from "./redux";

export const useRoom = (): Room => useAppSelector((state) => state.room);
