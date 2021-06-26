import { Box, Grid, GridItem } from "@chakra-ui/react";
import { RouteComponentProps } from "@reach/router";
import { skipToken } from "@reduxjs/toolkit/query";
import React, { useEffect, useMemo } from "react";

import { RoomActionWithUserDTO } from "@wewatch/actions";
import roomApi from "api/room";
import { SocketProvider } from "common/contexts/Socket";
import useNotify from "common/hooks/notification";
import { useAppDispatch } from "common/hooks/redux";

import { setRoom } from "../slice";
import Player from "./Player";
import Playlist from "./Playlist";

interface RoomProps extends RouteComponentProps {
  roomId?: string;
}

const Room = ({ roomId }: RoomProps): JSX.Element | null => {
  const notify = useNotify();
  const dispatch = useAppDispatch();
  const {
    data: room,
    isError,
    isSuccess,
  } = roomApi.endpoints.getRoom.useQuery(roomId ?? skipToken);

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
      actions: ({ action }: RoomActionWithUserDTO) => dispatch(action),
    }),
    [dispatch],
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

Room.defaultProps = {
  roomId: undefined,
};

export default Room;
