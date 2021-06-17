import { Box, Grid, GridItem } from "@chakra-ui/react";
import { navigate, RouteComponentProps } from "@reach/router";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useMemo } from "react";

import useNotify from "common/hooks/notification";
import { useAppDispatch } from "common/hooks/redux";
import { useRoom } from "common/hooks/selector";

import { SocketProvider } from "../contexts/Socket";
import { getRoom, setActivePlaylistId } from "../slice";
import Player from "./Player";
import Playlist from "./Playlist";

interface RoomProps extends RouteComponentProps {
  roomId?: string;
}

const Room = ({ roomId }: RoomProps): JSX.Element => {
  const notify = useNotify();
  const dispatch = useAppDispatch();
  const room = useRoom();

  useEffect(() => {
    if (roomId === undefined) {
      navigate("/");
      return;
    }

    if (room.id !== roomId) {
      dispatch(getRoom(roomId))
        .then(unwrapResult)
        .catch((e) =>
          notify({
            status: "error",
            title: e?.message ?? `Cannot get Room "${roomId}"`,
          }),
        );
    }
  }, [dispatch, room, roomId, notify]);

  useEffect(() => {
    const activePlaylistId = room.playlists?.[0]?.id ?? "";
    dispatch(setActivePlaylistId(activePlaylistId));
  }, [dispatch, room]);

  const socketOpts = useMemo(
    () => ({
      query: {
        roomId: roomId ?? "",
      },
    }),
    [roomId],
  );

  return (
    <SocketProvider namespace="rooms" socketOpts={socketOpts}>
      <Box>
        <Grid templateColumns="2.5fr 1fr" gap={2}>
          <GridItem>
            <Player url={room?.playlists?.[0]?.videos[0].url ?? null} />
          </GridItem>
          <GridItem>
            <Playlist />
          </GridItem>
        </Grid>
      </Box>
    </SocketProvider>
  );
};

Room.defaultProps = {
  roomId: undefined,
};

export default Room;
