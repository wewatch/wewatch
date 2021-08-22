import { Box, VStack } from "@chakra-ui/react";
import {
  DragDropContext,
  DragDropContextProps,
  Droppable,
} from "react-beautiful-dnd";

import { roomActions } from "@/actions/room";
import { SocketEvent } from "@/constants";
import { VideoDTO } from "@/schemas/room";
import { LexoRank } from "@/utils/rank";
import { compareVideo } from "@/utils/room";
import { useSocket } from "contexts/Socket";
import { useAppDispatch } from "hooks/redux";
import { useActivePlaylist } from "hooks/room";

import PlaylistContext from "../../contexts/Playlist";
import PlaylistItem from "./PlaylistItem";
import SearchBox from "./SearchBox";

const findNewRank = (
  videos: VideoDTO[],
  sourceIndex: number,
  destinationIndex: number,
): string => {
  const ranks = videos.map((v) => v.rank);

  if (destinationIndex === 0) {
    return LexoRank.parse(ranks[destinationIndex] ?? "")
      .genPrev()
      .toString();
  }

  if (destinationIndex === videos.length - 1) {
    return LexoRank.parse(ranks[destinationIndex] ?? "")
      .genNext()
      .toString();
  }

  const [removed] = ranks.splice(sourceIndex, 1);
  ranks.splice(destinationIndex, 0, removed ?? "");

  const prevRank = LexoRank.parse(ranks[destinationIndex - 1] ?? "");
  const nextRank = LexoRank.parse(ranks[destinationIndex + 1] ?? "");

  return prevRank.between(nextRank).toString();
};

const Playlist = (): JSX.Element | null => {
  const playlist = useActivePlaylist();
  const { socketEmit } = useSocket();
  const dispatch = useAppDispatch();

  if (playlist === undefined) {
    return null;
  }

  const sortedVideos = [...playlist.videos].sort(compareVideo);

  const items = sortedVideos.map((video, index) => (
    <PlaylistItem video={video} index={index} key={video.id} />
  ));

  const onDragEnd: DragDropContextProps["onDragEnd"] = ({
    destination,
    source,
    draggableId,
  }) => {
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const action = roomActions.updateVideo({
      playlistId: playlist.id,
      videoId: draggableId,
      rank: findNewRank(sortedVideos, source.index, destination.index),
    });

    dispatch(action);
    socketEmit(SocketEvent.RoomAction, action);
  };

  return (
    <PlaylistContext.Provider value={playlist}>
      <VStack maxHeight="calc(100vh - 64px)">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={playlist.id}>
            {(provided) => (
              <VStack
                ref={provided.innerRef}
                {...provided.droppableProps}
                flexShrink={1}
                overflowY="auto"
              >
                {items}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        </DragDropContext>
        <Box>
          <SearchBox />
        </Box>
      </VStack>
    </PlaylistContext.Provider>
  );
};

export default Playlist;
