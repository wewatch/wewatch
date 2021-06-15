import { Button, Center } from "@chakra-ui/react";
import { navigate, RouteComponentProps } from "@reach/router";
import React from "react";

import { IdDTO } from "@wewatch/schemas";
import RequestUtil from "common/api";
import useNotify from "common/hooks/notification";

const Home = (_: RouteComponentProps): JSX.Element => {
  const notify = useNotify();

  const handleCreateRoom = async () => {
    try {
      const { id } = await RequestUtil.post<IdDTO>("/rooms");

      await navigate(`/rooms/${id}`);
    } catch (e) {
      notify({
        status: "error",
        title: "Cannot create Room",
        description: e?.message ?? undefined,
      });
    }
  };

  return (
    <Center minH="100vh">
      <Button variant="solid" colorScheme="blue" onClick={handleCreateRoom}>
        Create a new room
      </Button>
    </Center>
  );
};

export default Home;
