import { IconButton, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPlay, FaTrashAlt } from "react-icons/fa";

import type { VideoDTO } from "@wewatch/schemas";

import VideoDetailWithControl from "./VideoDetailWithControl";

const PlaylistItemController = ({ title, id }: VideoDTO): JSX.Element => {
  const handlePlay = () => {
    console.log(`Play ${title}`);
  };
  const handleDelete = () => {
    console.log(`Delete ${id}`);
  };

  return (
    <VStack spacing={0}>
      <IconButton
        aria-label="hello"
        icon={<FaPlay />}
        size="xs"
        variant="ghost"
        isRound
        onClick={handlePlay}
      />
      <IconButton
        aria-label="hello"
        icon={<FaTrashAlt />}
        size="xs"
        variant="ghost"
        isRound
        onClick={handleDelete}
      />
    </VStack>
  );
};

const PlaylistItem = (video: VideoDTO): JSX.Element => (
  <VideoDetailWithControl video={video} controller={PlaylistItemController} />
);

export default PlaylistItem;
