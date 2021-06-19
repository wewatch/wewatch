import { IconButton, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa";

import { roomActions } from "@wewatch/actions";
import { VideoDTO } from "@wewatch/schemas";
import { useSocket } from "common/contexts/Socket";

import { usePlaylist } from "../contexts/Playlist";
import VideoDetailWithControl from "./VideoDetailWithControl";

const SearchResultItemController = (video: VideoDTO): JSX.Element => {
  const { id: playlistId } = usePlaylist();
  const { socket, socketConnected } = useSocket();

  const handleAdd = () => {
    if (!socketConnected) {
      return;
    }

    socket?.emit(
      "actions",
      roomActions.addVideo({
        playlistId,
        video,
      }),
    );
  };

  return (
    <VStack spacing={0}>
      <IconButton
        aria-label="hello"
        icon={<FaPlus />}
        size="xs"
        variant="ghost"
        isRound
        onClick={handleAdd}
        disabled={!socketConnected}
      />
    </VStack>
  );
};

const SearchResultItem = (video: VideoDTO): JSX.Element => (
  <VideoDetailWithControl
    video={video}
    controller={SearchResultItemController}
  />
);

export default SearchResultItem;
