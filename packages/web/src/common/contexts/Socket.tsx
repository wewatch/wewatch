import React, { useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import {
  EventsMap,
  ReservedOrUserListener,
} from "socket.io-client/build/typed-events";

import useNotify from "common/hooks/notification";

type SocketStatus = "connecting" | "connected" | "disconnected";

interface SocketContextValue {
  socket: Socket | null;
  socketStatus: SocketStatus;
  socketConnected: boolean;
}

const defaultContext: SocketContextValue = {
  socket: null,
  socketStatus: "connecting",
  socketConnected: false,
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

  const notify = useNotify();

  useEffect(() => {
    const newSocket = io(
      `${process.env.REACT_APP_API_URL}/${namespace}`,
      socketOpts,
    );

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
  }, [namespace, socketOpts, eventHandlers, notify]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketStatus,
        socketConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => useContext(SocketContext);
