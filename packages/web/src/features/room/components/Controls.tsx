import { HStack, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";

import { Progress } from "common/components/ProgressBar";
import { usePlayerState, useProgress } from "common/hooks/selector";
import { secondsToHHMMSS } from "common/utils";

interface ControlsProps {
  setPlaying: (playing: boolean) => void;
}

const Controls = ({ setPlaying }: ControlsProps): JSX.Element => {
  const { playing } = usePlayerState();
  const { played, loaded, playedSeconds, duration } = useProgress();

  return (
    <div>
      <Progress size="xs" value={played * 100} buffer={loaded * 100} />
      <HStack align="center">
        <IconButton
          onClick={() => setPlaying(!playing)}
          variant="ghost"
          icon={playing ? <FaPause /> : <FaPlay />}
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
