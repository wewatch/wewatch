import { IconButton, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPlay, FaTrashAlt } from "react-icons/fa";

import type { VideoDetailProps } from "./VideoDetailWithControl";
import VideoDetailWithControl from "./VideoDetailWithControl";

const PlaylistItemController = ({ title }: VideoDetailProps): JSX.Element => {
  const handlePlay = () => {
    console.log(`Play ${title}`);
  };
  const handleDelete = () => {
    console.log(`Delete ${title}`);
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

const PlaylistItem = (props: VideoDetailProps): JSX.Element => (
  <VideoDetailWithControl {...props} controller={PlaylistItemController} />
);

export default PlaylistItem;
