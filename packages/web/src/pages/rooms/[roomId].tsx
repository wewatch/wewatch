import Room from "features/room/components/Room";
import { useRoomId } from "hooks/room";

const RoomPage = (): JSX.Element | null => {
  const roomId = useRoomId();

  if (roomId === null) {
    return null;
  }

  return <Room roomId={roomId} />;
};

export default RoomPage;
