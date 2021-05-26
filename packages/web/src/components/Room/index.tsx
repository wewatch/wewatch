import { Container, Grid } from "@material-ui/core";
import { navigate, RouteComponentProps } from "@reach/router";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect } from "react";

import { setNotification } from "actions/notification";
import { getRoom } from "actions/room";
import { useAppDispatch, useAppSelector } from "hooks/redux";

import Player from "./Player";
import Playlist from "./Playlist";

interface RoomProps extends RouteComponentProps {
  roomId?: string;
}

const Room = ({ roomId }: RoomProps): JSX.Element => {
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
      dispatch(
        setNotification({
          severity: "error",
          message: e.message ?? `Cannot get Room "${roomId}"`,
        }),
      );
    });
  }, [dispatch, room, roomId]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <Player url={room?.urls?.[0] ?? null} />
      </Grid>
      <Grid item xs={3}>
        <Playlist urls={room?.urls ?? []} />
      </Grid>
    </Grid>
  );
};

Room.defaultProps = {
  roomId: undefined,
};

export default Room;
