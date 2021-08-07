import { IconButton, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPause, FaPlay, FaTrashAlt } from "react-icons/fa";

import { roomActions } from "@/actions/room";
import { SocketEvent } from "@/constants";
import type { VideoDTO } from "@/schemas/room";
import { useSocket } from "common/contexts/Socket";
import { useAppDispatch } from "common/hooks/redux";
import { usePlayerState } from "common/hooks/selector";

import { usePlaylist } from "../contexts/Playlist";
import VideoDetailWithControl from "./VideoDetailWithControl";

const PlaylistItemController = ({ id, url }: VideoDTO): JSX.Element => {
  const { url: activeURL, playing } = usePlayerState();
  const { id: playlistId } = usePlaylist();
  const { socketEmit } = useSocket();
  const dispatch = useAppDispatch();

  const isActiveUrl = url === activeURL;

  const handlePlay = () => {
    if (isActiveUrl) {
      dispatch(roomActions.setPlaying(!playing));
      socketEmit(SocketEvent.Actions, roomActions.setPlaying(!playing));
    } else {
      socketEmit(
        SocketEvent.Actions,
        roomActions.setActiveURL({ playlistId, url }),
      );
    }
  };

  const handleDelete = () => {
    socketEmit(
      SocketEvent.Actions,
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
        icon={isActiveUrl && playing ? <FaPause /> : <FaPlay />}
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

interface PlaylistItemProps {
  video: VideoDTO;
}

const PlaylistItem = ({ video }: PlaylistItemProps): JSX.Element => (
  <VideoDetailWithControl video={video} controller={PlaylistItemController} />
);

export default PlaylistItem;
