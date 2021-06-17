import React, { useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

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

interface SocketProviderProps {
  namespace: string;
  children: React.ReactNode;
  socketOpts: Parameters<typeof io>[1];
}

export const SocketProvider = ({
  namespace,
  children,
  socketOpts,
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

    return () => {
      setSocket(null);
      newSocket.disconnect();
    };
  }, [namespace, socketOpts, notify]);

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
