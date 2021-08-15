import { AspectRatio, Skeleton, useBoolean } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { memberActions } from "@/actions/member";
import { roomActions } from "@/actions/room";
import { SocketEvent } from "@/constants";
import { useSocket } from "contexts/Socket";
import { useAppDispatch } from "hooks/redux";
import { usePlayerState } from "hooks/room";

import { setDuration, setProgress } from "../../slices/progress";
import Controls from "./Controls";

interface Progress {
  played: number;
  loaded: number;
  playedSeconds: number;
}

const Player = (): JSX.Element => {
  const { url, playing } = usePlayerState();
  const { socketEmit } = useSocket();
  const dispatch = useAppDispatch();
  const progressSynced = useRef(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useBoolean(false);

  const setPlaying = useCallback(
    (newPlaying: boolean) => {
      if (newPlaying !== playing) {
        dispatch(roomActions.setPlaying(newPlaying));
        socketEmit(SocketEvent.RoomAction, roomActions.setPlaying(newPlaying));
      }
    },
    [dispatch, playing, socketEmit],
  );

  const handleReady = useCallback(
    (player: ReactPlayer) => {
      if (progressSynced.current) {
        return;
      }

      socketEmit(SocketEvent.SyncProgress, (playedSeconds: number) => {
        progressSynced.current = true;

        if (playedSeconds > 0) {
          player.seekTo(playedSeconds, "seconds");
        }
      });
    },
    [socketEmit],
  );

  const handleEnded = useCallback(
    () => socketEmit(SocketEvent.MemberAction, memberActions.readyToNext()),
    [socketEmit],
  );

  const handleProgressChange = useCallback(
    (progress: Progress) => dispatch(setProgress(progress)),
    [dispatch],
  );

  const handleDurationChange = useCallback(
    (duration: number) => dispatch(setDuration(duration)),
    [dispatch],
  );

  return (
    <Skeleton isLoaded={!!url}>
      <AspectRatio ratio={16 / 9}>
        <ReactPlayer
          playing={playing}
          url={url ?? undefined}
          volume={volume}
          muted={muted}
          width="100%"
          height="100%"
          onReady={handleReady}
          onEnded={handleEnded}
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
        setPlaying={setPlaying}
        volume={volume}
        setVolume={setVolume}
        muted={muted}
        setMuted={setMuted}
      />
    </Skeleton>
  );
};

export default Player;
