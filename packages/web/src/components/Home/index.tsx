import { Button, Center } from "@chakra-ui/react";
import { navigate, RouteComponentProps } from "@reach/router";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";

import { createRoom } from "actions/room";
import useNotify from "hooks/notification";
import { useAppDispatch } from "hooks/redux";

const Home = (_: RouteComponentProps): JSX.Element => {
  const notify = useNotify();
  const dispatch = useAppDispatch();

  const handleCreateRoom = async () => {
    try {
      const { id } = unwrapResult(await dispatch(createRoom()));

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
