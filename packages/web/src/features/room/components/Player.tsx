import { AspectRatio } from "@chakra-ui/react";
import React, { useState } from "react";
import ReactPlayer from "react-player";

import type { ProgressInfo } from "./Controls";
import Controls from "./Controls";

interface PlayerProps {
  url: string | null;
}

const Player = ({ url }: PlayerProps): JSX.Element => {
  const [playing, setPlaying] = useState<boolean>(false);
  const handleTogglePlaying = () => setPlaying((p) => !p);

  const [progress, setProgress] = useState<ProgressInfo>({
    played: 0,
    loaded: 0,
    playedSeconds: 0,
  });
  const handleProgressChange = (p: ProgressInfo) => setProgress(p);

  const [duration, setDuration] = useState<number>(0);
  const handleDurationChange = (d: number) => setDuration(d);

  if (!url) {
    return <div>Loading</div>;
  }

  return (
    <>
      <AspectRatio ratio={16 / 9}>
        <ReactPlayer
          playing={playing}
          url={url}
          width="100%"
          height="100%"
          onProgress={handleProgressChange}
          onDuration={handleDurationChange}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </AspectRatio>
      <Controls
        playing={playing}
        handleTogglePlaying={handleTogglePlaying}
        progress={progress}
        duration={duration}
      />
    </>
  );
};

export default Player;
