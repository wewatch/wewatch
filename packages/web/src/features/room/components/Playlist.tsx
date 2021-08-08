import { VStack } from "@chakra-ui/react";
import React from "react";
import {
  DragDropContext,
  DragDropContextProps,
  Droppable,
} from "react-beautiful-dnd";

import { roomActions } from "@/actions/room";
import { LexoRank, SocketEvent } from "@/constants";
import { VideoDTO } from "@/schemas/room";
import { useSocket } from "common/contexts/Socket";
import { useAppDispatch } from "common/hooks/redux";
import { useActivePlaylist } from "common/hooks/selector";
import { compareVideo } from "common/utils";

import PlaylistContext from "../contexts/Playlist";
import PlaylistItem from "./PlaylistItem";
import SearchBox from "./SearchBox";

const findNewRank = (videos: VideoDTO[], index: number): string => {
  const getRank = (idx: number): string => videos[idx]?.rank ?? "";

  if (index === 0) {
    return LexoRank.parse(getRank(index)).genPrev().toString();
  }

  if (index === videos.length - 1) {
    return LexoRank.parse(getRank(index)).genNext().toString();
  }

  const prevRank = LexoRank.parse(getRank(index - 1));
  const nextRank = LexoRank.parse(getRank(index));

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
      rank: findNewRank(sortedVideos, destination.index),
    });

    dispatch(action);
    socketEmit(SocketEvent.Actions, action);
  };

  return (
    <PlaylistContext.Provider value={playlist}>
      <VStack>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={playlist.id}>
            {(provided) => (
              <VStack ref={provided.innerRef} {...provided.droppableProps}>
                {items}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        </DragDropContext>
        <SearchBox />
      </VStack>
    </PlaylistContext.Provider>
  );
};

export default Playlist;
