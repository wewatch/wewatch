import { Icon, Spinner, Tooltip, useInterval } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaBan, FaSignal } from "react-icons/all";

import { SocketEvent } from "@/constants";
import { SocketContextValue, useSocket } from "contexts/Socket";

const getNetworkStatusIcon = (
  socketStatus: SocketContextValue["socketStatus"],
): JSX.Element => {
  if (socketStatus === "disconnected") {
    return <Icon as={FaBan} />;
  }

  if (socketStatus === "ready") {
    return <Icon as={FaSignal} />;
  }

  return <Spinner size="sm" verticalAlign={"middle"} />;
};

const getNetworkStatusLabel = (
  socketStatus: SocketContextValue["socketStatus"],
  rtt: number,
): string => {
  if (socketStatus === "disconnected") {
    return "Disconnected";
  }

  if (socketStatus === "ready") {
    return `Latency: ${Math.round(rtt / 2)} ms`;
  }

  return "Connecting";
};

const NetworkStatus = (): JSX.Element => {
  const { socket, socketStatus } = useSocket();
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
    <Tooltip
      hasArrow
      label={getNetworkStatusLabel(socketStatus, rtt)}
      placement={"top"}
    >
      <span>{getNetworkStatusIcon(socketStatus)}</span>
    </Tooltip>
  );
};

export default NetworkStatus;
