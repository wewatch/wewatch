import { Box, Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect, useMemo } from "react";

import { WrappedRoomActionDTO } from "@/actions/room";
import { SocketEvent } from "@/constants";
import roomApi from "api/room";
import { SocketProvider } from "contexts/Socket";
import useNotify from "hooks/notification";
import { useAppDispatch, useAppStore } from "hooks/redux";

import { setRoom } from "../slices/room";
import Player from "./Player";
import Playlist from "./Playlist";

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps): JSX.Element | null => {
  const notify = useNotify();
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const {
    data: room,
    isError,
    isSuccess,
  } = roomApi.endpoints.getRoom.useQuery(roomId);

  useEffect(() => {
    if (isError) {
      notify({
        status: "error",
        title: `Cannot get Room "${roomId}"`,
      });
    }
  }, [roomId, notify, isError]);

  useEffect(() => {
    if (isSuccess && room) {
      dispatch(setRoom(room));
    }
  }, [dispatch, isSuccess, room]);

  const socketOpts = useMemo(
    () => ({
      query: {
        roomId: roomId ?? "",
      },
    }),
    [roomId],
  );

  const socketEventHandlers = useMemo(
    () => ({
      [SocketEvent.RoomAction]: ({ action }: WrappedRoomActionDTO) =>
        dispatch(action),
      [SocketEvent.SyncProgress]: (callback: (p: number) => void) =>
        callback(store.getState().progress.playedSeconds),
    }),
    [dispatch, store],
  );

  return isSuccess ? (
    <SocketProvider
      namespace="rooms"
      socketOpts={socketOpts}
      eventHandlers={socketEventHandlers}
    >
      <Box paddingY={2}>
        <Grid templateColumns="2.5fr 1fr" gap={2}>
          <GridItem>
            <Player />
          </GridItem>
          <GridItem>
            <Playlist />
          </GridItem>
        </Grid>
      </Box>
    </SocketProvider>
  ) : null;
};

export default Room;
