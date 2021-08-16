import { IconButton, VStack } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { FaPlus } from "react-icons/fa";

import { roomActions } from "@/actions/room";
import { SocketEvent } from "@/constants";
import { NewVideoDTO } from "@/schemas/room";
import { generateRankSuffix, LexoRank } from "@/utils/rank";
import { findMinMax } from "common/utils";
import { useSocket } from "contexts/Socket";

import { usePlaylist } from "../../contexts/Playlist";
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
      SocketEvent.RoomAction,
      roomActions.addVideo({
        playlistId,
        video: {
          ...video,
          id: nanoid(),
          rank: rankObj.toString() + generateRankSuffix(),
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
