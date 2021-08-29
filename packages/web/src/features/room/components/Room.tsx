import { Grid, GridItem, VStack } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";

import { WrappedMemberActionDTO } from "@/actions/member";
import { WrappedRoomActionDTO } from "@/actions/room";
import { SocketEvent, SyncType, SyncValue } from "@/constants";
import roomApi from "api/room";
import { SocketProvider } from "contexts/Socket";
import useNotify from "hooks/notification";
import { useAppDispatch, useAppStore } from "hooks/redux";

import { JoinRoomProvider } from "../contexts/JoinRoom";
import { addActivity } from "../slices/activities";
import JoinRoomModal from "./JoinRoomModal";
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
      [SocketEvent.RoomAction]: (wrappedAction: WrappedRoomActionDTO) => {
        const { action } = wrappedAction;

        dispatch(action);
        dispatch(addActivity(wrappedAction));
      },

      [SocketEvent.MemberAction]: (wrappedAction: WrappedMemberActionDTO) => {
        const {
          userId,
          action: { type, payload },
        } = wrappedAction;

        dispatch({
          type,
          payload: { userId, ...payload },
        });
        dispatch(addActivity(wrappedAction));
      },

      [SocketEvent.Sync]: (
        type: SyncType,
        callback: (syncValue: SyncValue) => void,
      ) => {
        if (type === SyncType.Progress) {
          callback(store.getState().progress.playedSeconds);
        } else if (type === SyncType.Activities) {
          callback(store.getState().activities.slice(0, 100));
        }
      },
    }),
    [dispatch, store],
  );

  return (
    <SocketProvider
      namespace="rooms"
      socketOpts={socketOpts}
      eventHandlers={socketEventHandlers}
    >
      <JoinRoomProvider>
        <JoinRoomModal />
        <Grid templateColumns="2.5fr 1fr" gap={2}>
          <GridItem>
            <VStack marginTop={2} height="calc(100vh - 56px)" overflowY="auto">
              <Player />
              <RoomInfo />
            </VStack>
          </GridItem>
          <GridItem>
            <Playlist />
          </GridItem>
        </Grid>
      </JoinRoomProvider>
    </SocketProvider>
  );
};

export default Room;
