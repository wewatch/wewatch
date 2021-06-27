import { AspectRatio, Skeleton } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import ReactPlayer from "react-player";

import { roomActions } from "@wewatch/actions";
import { useSocket } from "common/contexts/Socket";
import { usePlayerState } from "common/hooks/selector";

import type { ProgressInfo } from "./Controls";
import Controls from "./Controls";

const Player = (): JSX.Element => {
  const { url, playing } = usePlayerState();
  const { socketEmit } = useSocket();

  const setPlaying = useCallback(
    (newPlaying: boolean) => {
      if (newPlaying !== playing) {
        socketEmit("actions", roomActions.setPlaying(newPlaying));
      }
    },
    [socketEmit, playing],
  );

  const [progress, setProgress] = useState<ProgressInfo>({
    played: 0,
    loaded: 0,
    playedSeconds: 0,
  });
  const handleProgressChange = (p: ProgressInfo) => setProgress(p);

  const [duration, setDuration] = useState<number>(0);
  const handleDurationChange = (d: number) => setDuration(d);

  return (
    <Skeleton isLoaded={!!url}>
      <AspectRatio ratio={16 / 9}>
        <ReactPlayer
          playing={playing}
          url={url ?? undefined}
          width="100%"
          height="100%"
          onProgress={handleProgressChange}
          onDuration={handleDurationChange}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          config={{
            youtube: {
              playerVars: {
                disablekb: 1,
              },
            },
          }}
        />
      </AspectRatio>
      <Controls
        playing={playing}
        setPlaying={setPlaying}
        progress={progress}
        duration={duration}
      />
    </Skeleton>
  );
};

export default Player;
