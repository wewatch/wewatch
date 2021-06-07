import { Box, Grid, GridItem } from "@chakra-ui/react";
import { navigate, RouteComponentProps } from "@reach/router";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect } from "react";

import { getRoom } from "actions/room";
import useNotify from "hooks/notification";
import { useAppDispatch, useAppSelector } from "hooks/redux";

import Player from "./Player";
import Playlist from "./Playlist";

interface RoomProps extends RouteComponentProps {
  roomId?: string;
}

const Room = ({ roomId }: RoomProps): JSX.Element => {
  const notify = useNotify();
  const dispatch = useAppDispatch();
  const room = useAppSelector((state) => state.room);

  useEffect(() => {
    const getRoomInfo = async () => {
      if (roomId === undefined) {
        await navigate("/");
        return;
      }

      if (room?.id !== roomId) {
        unwrapResult(await dispatch(getRoom(roomId)));
      }
    };

    getRoomInfo().catch((e) => {
      notify({
        status: "error",
        title: e.message ?? `Cannot get Room "${roomId}"`,
      });
    });
  }, [dispatch, room, roomId, notify]);

  return (
    <Box>
      <Grid templateColumns="2.5fr 1fr" gap={2}>
        <GridItem>
          <Player url={room?.playlist.videos[0].url ?? null} />
        </GridItem>
        <GridItem>{room && <Playlist playlist={room.playlist} />}</GridItem>
      </Grid>
    </Box>
  );
};

Room.defaultProps = {
  roomId: undefined,
};

export default Room;
