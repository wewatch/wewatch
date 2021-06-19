import { PlayerStateDTO, PlaylistDTO } from "@wewatch/schemas";

import { useAppSelector } from "./redux";

export const usePlayerState = (): PlayerStateDTO =>
  useAppSelector((state) => state.room.playerState);

export const useActivePlaylist = (): PlaylistDTO | undefined => {
  const playlists = useAppSelector((state) => state.room.playlists);
  const activePlaylistId = useAppSelector(
    (state) => state.room.activePlaylistId,
  );

  return playlists.find((p) => p.id === activePlaylistId);
};
