import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import ReactPlayer from "react-player";

import type { Progress } from "./Controls";
import Controls from "./Controls";

const useStyles = makeStyles(() => ({
  wrapper: {
    position: "relative",
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  player: {
    position: "absolute",
    top: 0,
    left: 0,
  },
}));

interface PlayerProps {
  url: string | null;
}

const Player = ({ url }: PlayerProps): JSX.Element => {
  const classes = useStyles();

  const [playing, setPlaying] = useState<boolean>(false);
  const handleTogglePlaying = () => setPlaying((p) => !p);

  const [progress, setProgress] = useState<Progress>({
    played: 0,
    loaded: 0,
    playedSeconds: 0,
  });
  const handleProgressChange = (p: Progress) => setProgress(p);

  const [duration, setDuration] = useState<number>(0);
  const handleDurationChange = (d: number) => setDuration(d);

  if (!url) {
    return <div>Loading</div>;
  }

  return (
    <div className={classes.wrapper}>
      <ReactPlayer
        className={classes.player}
        playing={playing}
        url={url}
        width="100%"
        height="100%"
        onProgress={handleProgressChange}
        onDuration={handleDurationChange}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <Controls
        playing={playing}
        handleTogglePlaying={handleTogglePlaying}
        progress={progress}
        duration={duration}
      />
    </div>
  );
};

export default Player;
