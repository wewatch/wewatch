import { Box, Grid, GridItem } from "@chakra-ui/react";
import { RouteComponentProps } from "@reach/router";
import React, { useEffect, useMemo } from "react";

import { useGetRoomQuery } from "api";
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
  const { data: room, isError, isSuccess } = useGetRoomQuery(roomId ?? "");

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
      actions: dispatch,
    }),
    [dispatch],
  );

  return isSuccess ? (
    <SocketProvider
      namespace="rooms"
      socketOpts={socketOpts}
      eventHandlers={socketEventHandlers}
    >
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
  ) : null;
};

Room.defaultProps = {
  roomId: undefined,
};

export default Room;
