import { PlayerStateDTO, PlaylistDTO } from "@/schemas/room";
import { MembersState } from "features/room/slices/members";
import { Progress } from "features/room/slices/progress";

import { useAppSelector } from "./redux";

export const usePlayerState = (): PlayerStateDTO =>
  useAppSelector((state) => state.room.playerState);

export const useActivePlaylist = (): PlaylistDTO | undefined => {
  const playlists = useAppSelector((state) => state.room.playlists);
  const activePlaylistId = useAppSelector(
    (state) => state.room.playerState.activePlaylistId,
  );

  return playlists.find((p) => p.id === activePlaylistId) ?? playlists[0];
};

export const useProgress = (): Progress =>
  useAppSelector((state) => state.progress);

export const useMembers = (): MembersState =>
  useAppSelector((state) => state.members);
