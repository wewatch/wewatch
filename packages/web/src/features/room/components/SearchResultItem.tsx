import { IconButton, VStack } from "@chakra-ui/react";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { FaPlus } from "react-icons/fa";

import { NonPersistedVideoDTO } from "@wewatch/schemas";
import useNotify from "common/hooks/notification";
import { useAppDispatch } from "common/hooks/redux";
import { useRoom } from "common/hooks/selector";

import { usePlaylist } from "../contexts/Playlist";
import { addVideoToPlaylist } from "../slice";
import VideoDetailWithControl from "./VideoDetailWithControl";

const SearchResultItemController = (
  video: NonPersistedVideoDTO,
): JSX.Element => {
  const notify = useNotify();
  const dispatch = useAppDispatch();
  const { id: roomId } = useRoom();
  const { id: playlistId } = usePlaylist();

  const handleAdd = () =>
    dispatch(addVideoToPlaylist({ roomId, playlistId, video }))
      .then(unwrapResult)
      .catch((e) =>
        notify({
          status: "error",
          title: e?.message ?? "Cannot add video",
        }),
      );

  return (
    <VStack spacing={0}>
      <IconButton
        aria-label="hello"
        icon={<FaPlus />}
        size="xs"
        variant="ghost"
        isRound
        onClick={handleAdd}
      />
    </VStack>
  );
};

const SearchResultItem = (video: NonPersistedVideoDTO): JSX.Element => (
  <VideoDetailWithControl
    video={video}
    controller={SearchResultItemController}
  />
);

export default SearchResultItem;
