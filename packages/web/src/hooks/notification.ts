import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

import type { Notification } from "utils/types";

const useNotify = (): ((notification: Notification) => void) => {
  const toast = useToast();

  return useCallback(
    (notification: Notification): void => {
      toast({
        ...notification,
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast],
  );
};

export default useNotify;
