import { useToast } from "@chakra-ui/react";

import type { Notification } from "utils/types";

const useNotify = (): ((notification: Notification) => void) => {
  const toast = useToast();

  return (notification: Notification): void => {
    toast({
      ...notification,
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };
};

export default useNotify;
