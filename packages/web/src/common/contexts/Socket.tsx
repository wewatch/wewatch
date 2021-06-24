import React, { useCallback, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import {
  EventNames,
  EventParams,
  EventsMap,
  ReservedOrUserListener,
} from "socket.io-client/build/typed-events";

import useNotify from "common/hooks/notification";
import { useAccessToken } from "common/hooks/selector";

type SocketStatus = "connecting" | "connected" | "disconnected";

type SocketEmit = (
  event: string,
  ...args: EventParams<EventsMap, EventNames<EventsMap>>
) => void;

interface SocketContextValue {
  socket: Socket | null;
  socketStatus: SocketStatus;
  socketConnected: boolean;
  socketEmit: SocketEmit;
}

const defaultContext: SocketContextValue = {
  socket: null,
  socketStatus: "connecting",
  socketConnected: false,
  socketEmit: () => {},
};

const SocketContext = React.createContext<SocketContextValue>(defaultContext);

type Handler = ReservedOrUserListener<EventsMap, EventsMap, string>;

interface SocketProviderProps {
  namespace: string;
  children: React.ReactNode;
  socketOpts: Parameters<typeof io>[1];
  eventHandlers: Record<string, Handler>;
}

export const SocketProvider = ({
  namespace,
  children,
  socketOpts,
  eventHandlers,
}: SocketProviderProps): JSX.Element => {
  const [socket, setSocket] = useState<SocketContextValue["socket"]>(
    defaultContext.socket,
  );

  const [socketStatus, setSocketStatus] = useState<
    SocketContextValue["socketStatus"]
  >(defaultContext.socketStatus);

  const socketConnected = socketStatus === "connected";

  const accessToken = useAccessToken();
  const notify = useNotify();

  useEffect(() => {
    if (accessToken !== undefined) {
      const newSocket = io(`${process.env.REACT_APP_API_URL}/${namespace}`, {
        ...socketOpts,
        auth: {
          accessToken,
        },
      });

      setSocket(newSocket);

      newSocket.on("connect", () => setSocketStatus("connected"));
      newSocket.on("disconnect", () => setSocketStatus("connecting"));
      newSocket.on("connect_error", () => setSocketStatus("disconnected"));
      newSocket.on("exception", (response) =>
        notify({
          status: "error",
          title: response.message,
        }),
      );

      Object.entries(eventHandlers).forEach(([event, handler]) => {
        newSocket.on(event, handler);
      });

      return () => {
        setSocket(null);
        newSocket.disconnect();
      };
    }

    return () => {};
  }, [namespace, socketOpts, eventHandlers, notify, accessToken]);

  useEffect(() => {
    if (accessToken === undefined) {
      socket?.disconnect();
      setSocket(null);
    }
  }, [accessToken, socket]);

  const socketEmit: SocketEmit = useCallback(
    (event, ...args) => {
      if (!socketConnected) {
        return;
      }

      socket?.emit(event, ...args);
    },
    [socket, socketConnected],
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketStatus,
        socketConnected,
        socketEmit,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => useContext(SocketContext);
