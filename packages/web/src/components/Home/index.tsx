import { Button, Container } from "@material-ui/core";
import { navigate, RouteComponentProps } from "@reach/router";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";

import { setNotification } from "actions/notification";
import { createRoom } from "actions/room";
import { useAppDispatch } from "hooks/redux";

const Home = (_: RouteComponentProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleClick = async () => {
    try {
      const { id } = unwrapResult(await dispatch(createRoom()));

      await navigate(`/rooms/${id}`);
    } catch (e) {
      dispatch(
        setNotification({
          severity: "error",
          message: e.message ?? "Add category failed",
        }),
      );
    }
  };

  return (
    <Container>
      <Button color="primary" variant="contained" onClick={handleClick}>
        Create a new room
      </Button>
    </Container>
  );
};

export default Home;
