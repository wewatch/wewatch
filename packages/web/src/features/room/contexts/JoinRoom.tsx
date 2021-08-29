import { createContext, ReactNode, useContext, useState } from "react";

interface JoinRoomContextValue {
  joinedRoom: boolean;
  setJoinedRoom: (arg: boolean) => void;
}

const defaultContext: JoinRoomContextValue = {
  joinedRoom: false,
  setJoinedRoom: () => {},
};

const JoinRoomContext = createContext<JoinRoomContextValue>(defaultContext);

interface JoinRoomProviderProps {
  children: ReactNode;
}

export const JoinRoomProvider = ({
  children,
}: JoinRoomProviderProps): JSX.Element => {
  const [joinedRoom, setJoinedRoom] = useState(false);

  return (
    <JoinRoomContext.Provider
      value={{
        joinedRoom,
        setJoinedRoom,
      }}
    >
      {children}
    </JoinRoomContext.Provider>
  );
};

export const useJoinRoom = (): JoinRoomContextValue =>
  useContext(JoinRoomContext);
