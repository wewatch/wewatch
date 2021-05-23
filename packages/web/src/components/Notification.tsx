import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React from "react";

import { clearNotification } from "actions/notification";
import { useAppDispatch, useAppSelector } from "hooks/redux";

const Notification = (): JSX.Element => {
  const notification = useAppSelector((state) => state.notification);

  const dispatch = useAppDispatch();
  const handleClose = () => dispatch(clearNotification());

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={!!notification}
      onClose={handleClose}
      autoHideDuration={3000}
    >
      <Alert severity={notification?.severity} variant="filled">
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
