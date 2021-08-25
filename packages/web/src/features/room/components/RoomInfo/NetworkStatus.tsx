import { Icon, Tooltip, useInterval } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaSignal } from "react-icons/all";

import { SocketEvent } from "@/constants";
import { useSocket } from "contexts/Socket";

const NetworkStatus = (): JSX.Element => {
  const { socket } = useSocket();
  const [rtt, setRtt] = useState(0);
  const pingTimestamp = useRef(0);

  useInterval(() => {
    if (socket) {
      pingTimestamp.current = Date.now();
      socket.emit(SocketEvent.Ping, () => {
        setRtt(Date.now() - pingTimestamp.current);
      });
    }
  }, 29_000);

  return (
    <Tooltip hasArrow label={`Latency: ${Math.round(rtt / 2)} ms`}>
      <span>
        <Icon as={FaSignal} />
      </span>
    </Tooltip>
  );
};

export default NetworkStatus;
