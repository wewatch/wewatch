import { Box, IconButton, VStack } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { FaPause, FaPlay, FaTrashAlt } from "react-icons/fa";

import { roomActions } from "@/actions/room";
import { SocketEvent } from "@/constants";
import type { VideoDTO } from "@/schemas/room";
import { useSocket } from "contexts/Socket";
import { useAppDispatch } from "hooks/redux";
import { usePlayerState } from "hooks/room";

import { usePlaylist } from "../../contexts/Playlist";
import VideoDetailWithControl from "./VideoDetailWithControl";

const PlaylistItemController = ({ id, url, title }: VideoDTO): JSX.Element => {
  const { url: activeURL, playing } = usePlayerState();
  const { id: playlistId } = usePlaylist();
  const { socketEmit } = useSocket();
  const dispatch = useAppDispatch();

  const isActiveUrl = url === activeURL;

  const handlePlay = () => {
    if (isActiveUrl) {
      dispatch(roomActions.setPlaying(!playing));
      socketEmit(SocketEvent.RoomAction, roomActions.setPlaying(!playing));
    } else {
      socketEmit(
        SocketEvent.RoomAction,
        roomActions.setActiveURL({
          playlistId,
          url,
          title,
        }),
      );
    }
  };

  const handleDelete = () => {
    socketEmit(
      SocketEvent.RoomAction,
      roomActions.deleteVideo({
        playlistId,
        videoId: id,
        title,
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
  index: number;
}

const PlaylistItem = ({ video, index }: PlaylistItemProps): JSX.Element => (
  <Draggable draggableId={video.id} index={index}>
    {(provided) => (
      <Box
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        width="100%"
      >
        <VideoDetailWithControl
          video={video}
          controller={PlaylistItemController}
        />
      </Box>
    )}
  </Draggable>
);

export default PlaylistItem;
