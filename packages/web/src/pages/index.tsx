import { Button, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import roomApi from "api/room";
import { useAuth } from "contexts/Auth";
import useNotify from "hooks/notification";

const Home = (): JSX.Element => {
  const router = useRouter();
  const notify = useNotify();
  const { user } = useAuth();

  const [createRoom, { data, isError, isSuccess }] =
    roomApi.endpoints.createRoom.useMutation();

  useEffect(() => {
    if (isError) {
      notify({
        status: "error",
        title: "Cannot create Room",
      });
    }
  }, [isError, notify]);

  useEffect(() => {
    if (isSuccess && data?.id) {
      router.push(`/rooms/${data.id}`);
    }
  }, [isSuccess, data, router]);

  return (
    <Center height="100%">
      <Button
        variant="solid"
        colorScheme="blue"
        onClick={() => createRoom(null)}
        isDisabled={user === null}
      >
        Create a new room
      </Button>
    </Center>
  );
};

export default Home;
