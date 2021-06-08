import { VStack } from "@chakra-ui/react";
import React from "react";

import { PlaylistDTO } from "@wewatch/schemas";

import PlaylistItem from "./PlaylistItem";
import VideoSearchBox from "./VideoSearchBox";

interface PlaylistProps {
  playlist: PlaylistDTO;
}

const Playlist = ({ playlist }: PlaylistProps): JSX.Element | null => {
  const items = playlist.videos.map((video) => (
    <PlaylistItem video={video} key={video.url} />
  ));
  return (
    <VStack>
      {items}
      <VideoSearchBox />
    </VStack>
  );
};

export default Playlist;
