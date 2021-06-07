import { HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";

import { Progress } from "components/common/ProgressBar";
import { secondsToHHMMSS } from "utils/misc";

export interface ProgressInfo {
  played: number;
  loaded: number;
  playedSeconds: number;
}

interface ControlsProps {
  playing: boolean;
  handleTogglePlaying: () => void;
  progress: ProgressInfo;
  duration: number;
}

const Controls = ({
  playing,
  handleTogglePlaying,
  progress,
  duration,
}: ControlsProps): JSX.Element => {
  const { played, loaded, playedSeconds } = progress;

  return (
    <div>
      <Progress size="xs" value={played * 100} buffer={loaded * 100} />
      <HStack align="center">
        <IconButton
          onClick={handleTogglePlaying}
          variant="ghost"
          icon={playing ? <Icon as={FaPause} /> : <Icon as={FaPlay} />}
          aria-label={playing ? "pause" : "play"}
        />
        <Text as="span">
          {`${secondsToHHMMSS(playedSeconds)} / ${secondsToHHMMSS(duration)}`}
        </Text>
      </HStack>
    </div>
  );
};
export default Controls;
