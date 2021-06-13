import { VStack } from "@chakra-ui/react";
import React from "react";

import { useRoom, useRoomState } from "common/hooks/selector";

import PlaylistContext from "../contexts/Playlist";
import PlaylistItem from "./PlaylistItem";
import SearchBox from "./SearchBox";

const Playlist = (): JSX.Element | null => {
  const { playlists } = useRoom();
  const { activePlaylistId: playlistId } = useRoomState();
  const playlist = playlists.find((p) => p.id === playlistId);

  if (playlist === undefined) {
    return null;
  }

  const items = playlist.videos.map((video) => (
    <PlaylistItem {...video} key={video.url} />
  ));

  return (
    <PlaylistContext.Provider value={playlist}>
      <VStack>
        {items}
        <SearchBox />
      </VStack>
    </PlaylistContext.Provider>
  );
};

export default Playlist;
