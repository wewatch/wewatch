import { Box, Button, LinearProgress, Typography } from "@material-ui/core";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import React from "react";

import { secondsToHHMMSS } from "utils/misc";

export interface Progress {
  played: number;
  loaded: number;
  playedSeconds: number;
}

interface ControlsProps {
  playing: boolean;
  handleTogglePlaying: () => void;
  progress: Progress;
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
      <LinearProgress
        variant="buffer"
        value={played * 100}
        valueBuffer={loaded * 100}
      />
      <Box display="flex" alignItems="center">
        <Button onClick={handleTogglePlaying}>
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </Button>
        <Box p={0.5}>
          <Typography component="span">{`${secondsToHHMMSS(
            playedSeconds,
          )} / ${secondsToHHMMSS(duration)}`}</Typography>
        </Box>
      </Box>
    </div>
  );
};
export default Controls;
