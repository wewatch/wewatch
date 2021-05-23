import { Container } from "@material-ui/core";
import { navigate, RouteComponentProps } from "@reach/router";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect } from "react";

import { setNotification } from "actions/notification";
import { getRoom } from "actions/room";
import { useAppDispatch, useAppSelector } from "hooks/redux";

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

  return <Container>{`Room #${roomId}`}</Container>;
};

Room.defaultProps = {
  roomId: undefined,
};

export default Room;
