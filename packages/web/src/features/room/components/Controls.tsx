import { HStack, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";

import { roomActions } from "@wewatch/actions";
import { Progress } from "common/components/ProgressBar";
import { useAppDispatch } from "common/hooks/redux";
import { secondsToHHMMSS } from "common/misc";

export interface ProgressInfo {
  played: number;
  loaded: number;
  playedSeconds: number;
}

interface ControlsProps {
  playing: boolean;
  progress: ProgressInfo;
  duration: number;
}

const Controls = ({
  playing,
  progress,
  duration,
}: ControlsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { played, loaded, playedSeconds } = progress;

  // Note: ReactPlayer always sends `setPlaying` action to the server, hence
  // we do not send `setPlaying` here, instead, we dispatch it directly and
  // rely on ReactPlayer to sends the action.

  return (
    <div>
      <Progress size="xs" value={played * 100} buffer={loaded * 100} />
      <HStack align="center">
        <IconButton
          onClick={() => dispatch(roomActions.setPlaying(!playing))}
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
