import { VStack } from "@chakra-ui/react";
import React from "react";

import { PlaylistDTO } from "@wewatch/schemas";

import PlaylistItem from "./PlaylistItem";
import SearchBox from "./SearchBox";

interface PlaylistProps {
  playlist: PlaylistDTO;
}

const Playlist = ({ playlist }: PlaylistProps): JSX.Element | null => {
  const items = playlist.videos.map((video) => (
    <PlaylistItem {...video} key={video.url} />
  ));
  return (
    <VStack>
      {items}
      <SearchBox />
    </VStack>
  );
};

export default Playlist;
