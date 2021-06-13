import { IconButton, VStack } from "@chakra-ui/react";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { FaPlay, FaTrashAlt } from "react-icons/fa";

import type { VideoDTO } from "@wewatch/schemas";
import useNotify from "common/hooks/notification";
import { useAppDispatch } from "common/hooks/redux";
import { useRoom } from "common/hooks/selector";

import { deleteVideoFromPlaylist } from "../action";
import { usePlaylist } from "../contexts/Playlist";
import VideoDetailWithControl from "./VideoDetailWithControl";

const PlaylistItemController = ({ title, id }: VideoDTO): JSX.Element => {
  const notify = useNotify();
  const dispatch = useAppDispatch();
  const { id: roomId } = useRoom();
  const { id: playlistId } = usePlaylist();

  const handlePlay = () => {};

  const handleDelete = () =>
    dispatch(deleteVideoFromPlaylist({ roomId, playlistId, videoId: id }))
      .then(unwrapResult)
      .catch((e) =>
        notify({
          status: "error",
          title: e?.message ?? "Cannot remove video",
        }),
      );

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
