import { IconButton, VStack } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import React from "react";
import { FaPlus } from "react-icons/fa";

import { roomActions } from "@/actions/room";
import { LexoRank, SocketEvent } from "@/constants";
import { NewVideoDTO } from "@/schemas/room";
import { useSocket } from "common/contexts/Socket";
import { findMinMax } from "common/utils";

import { usePlaylist } from "../contexts/Playlist";
import VideoDetailWithControl from "./VideoDetailWithControl";

const SearchResultItemController = (video: NewVideoDTO): JSX.Element => {
  const { id: playlistId, videos } = usePlaylist();
  const { socketEmit, socketConnected } = useSocket();

  const handleAdd = () => {
    const { max: maxRank } = findMinMax(videos.map((v) => v.rank));

    let rankObj: LexoRank;

    if (!maxRank) {
      rankObj = LexoRank.initial();
    } else {
      rankObj = LexoRank.parse(maxRank).genNext();
    }

    socketEmit(
      SocketEvent.Actions,
      roomActions.addVideo({
        playlistId,
        video: {
          ...video,
          id: nanoid(),
          rank: rankObj.toString(),
        },
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

interface SearchResultItemProps {
  video: NewVideoDTO;
}

const SearchResultItem = ({ video }: SearchResultItemProps): JSX.Element => (
  <VideoDetailWithControl
    video={video}
    controller={SearchResultItemController}
  />
);

export default SearchResultItem;
