import { Box, HStack, IconButton, Text, useBoolean } from "@chakra-ui/react";
import { FaPause, FaPlay } from "react-icons/fa";

import { secondsToHHMMSS } from "common/utils";
import { Progress } from "components/ProgressBar";
import { usePlayerState, useProgress } from "hooks/room";

import VolumeControl from "./VolumeControl";

interface ControlsProps {
  setPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  muted: boolean;
  setMuted: ReturnType<typeof useBoolean>[1];
}

const Controls = ({
  setPlaying,
  volume,
  setVolume,
  muted,
  setMuted,
}: ControlsProps): JSX.Element => {
  const { url, playing } = usePlayerState();
  const { played, loaded, playedSeconds, duration } = useProgress();

  return (
    <Box>
      <Progress size="xs" value={played * 100} buffer={loaded * 100} />
      <HStack align="center" spacing={1} paddingX={1}>
        <IconButton
          disabled={url === null}
          onClick={() => setPlaying(!playing)}
          variant="ghost"
          icon={playing ? <FaPause /> : <FaPlay />}
          aria-label={playing ? "pause" : "play"}
        />
        <VolumeControl
          volume={volume}
          setVolume={setVolume}
          muted={muted}
          setMuted={setMuted}
        />
        <Text as="span" paddingX={2}>
          {`${secondsToHHMMSS(playedSeconds)} / ${secondsToHHMMSS(duration)}`}
        </Text>
      </HStack>
    </Box>
  );
};

export default Controls;
