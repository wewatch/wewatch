import { Grid, GridItem, VStack } from "@chakra-ui/react";
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
import RoomInfo from "./RoomInfo";

interface RoomProps {
  roomId: string;
}

const Room = ({ roomId }: RoomProps): JSX.Element | null => {
  const notify = useNotify();
  const store = useAppStore();
  const dispatch = useAppDispatch();

  const { isError: isGetRoomError } =
    roomApi.endpoints.getRoom.useQuery(roomId);

  const { isError: isGetMembersError } =
    roomApi.endpoints.getRoomMembers.useQuery(roomId);

  const getDataError = isGetRoomError || isGetMembersError;

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

  return (
    <SocketProvider
      namespace="rooms"
      socketOpts={socketOpts}
      eventHandlers={socketEventHandlers}
    >
      <Grid templateColumns="2.5fr 1fr" gap={2}>
        <GridItem>
          <VStack maxHeight="calc(100vh - 64px)" overflowY="auto">
            <Player />
            <RoomInfo />
          </VStack>
        </GridItem>
        <GridItem>
          <Playlist />
        </GridItem>
      </Grid>
    </SocketProvider>
  );
};

export default Room;
