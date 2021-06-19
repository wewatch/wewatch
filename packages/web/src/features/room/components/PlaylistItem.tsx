import { IconButton, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPlay, FaTrashAlt } from "react-icons/fa";

import { roomActions } from "@wewatch/actions";
import type { VideoDTO } from "@wewatch/schemas";
import { useSocket } from "common/contexts/Socket";

import { usePlaylist } from "../contexts/Playlist";
import VideoDetailWithControl from "./VideoDetailWithControl";

const PlaylistItemController = ({ id }: VideoDTO): JSX.Element => {
  const { id: playlistId } = usePlaylist();
  const { socket, socketConnected } = useSocket();

  const handlePlay = () => {};

  const handleDelete = () => {
    if (!socketConnected) {
      return;
    }

    socket?.emit(
      "actions",
      roomActions.deleteVideo({
        playlistId,
        videoId: id,
      }),
    );
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
