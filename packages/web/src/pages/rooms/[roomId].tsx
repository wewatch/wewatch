import { useRouter } from "next/router";

import Room from "features/room/components/Room";

const isValidRoomId = (
  roomId: ReturnType<typeof useRouter>["query"][string],
): roomId is string => typeof roomId === "string";

const RoomPage = (): JSX.Element | null => {
  const router = useRouter();
  const { roomId } = router.query;

  if (!isValidRoomId(roomId)) {
    return null;
  }

  return <Room roomId={roomId} />;
};

export default RoomPage;
