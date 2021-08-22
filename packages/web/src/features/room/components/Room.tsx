import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";

import { WrappedMemberActionDTO } from "@/actions/member";
import { WrappedRoomActionDTO } from "@/actions/room";
import { SocketEvent } from "@/constants";
import roomApi from "api/room";
import { SocketProvider } from "contexts/Socket";
import useNotify from "hooks/notification";
import { useAppDispatch, useAppStore } from "hooks/redux";

import Player from "./Player";
import Playlist from "./Playlist";

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps): JSX.Element | null => {
  const notify = useNotify();
  const store = useAppStore();
  const dispatch = useAppDispatch();

  const { isError: isGetRoomError, isSuccess: isGetRoomSuccess } =
    roomApi.endpoints.getRoom.useQuery(roomId);

  const { isError: isGetMembersError, isSuccess: isGetMembersSuccess } =
    roomApi.endpoints.getRoomMembers.useQuery(roomId);

  const getDataError = isGetRoomError || isGetMembersError;
  const getDataSuccess = isGetRoomSuccess && isGetMembersSuccess;

  useEffect(() => {
    if (getDataError) {
      notify({
        status: "error",
        title: `Cannot get Room "${roomId}"`,
      });
    }
  }, [roomId, notify, getDataError]);

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

      [SocketEvent.MemberAction]: ({
        userId,
        action: { type, payload },
      }: WrappedMemberActionDTO) => {
        dispatch({
          type,
          payload: { userId, ...payload },
        });
      },

      [SocketEvent.SyncProgress]: (callback: (p: number) => void) =>
        callback(store.getState().progress.playedSeconds),
    }),
    [dispatch, store],
  );

  return getDataSuccess ? (
    <SocketProvider
      namespace="rooms"
      socketOpts={socketOpts}
      eventHandlers={socketEventHandlers}
    >
      <Grid templateColumns="2.5fr 1fr" gap={2}>
        <GridItem>
          <Player />
        </GridItem>
        <GridItem>
          <Playlist />
        </GridItem>
      </Grid>
    </SocketProvider>
  ) : null;
};

export default Room;
