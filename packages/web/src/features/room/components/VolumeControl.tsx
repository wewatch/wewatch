import {
  Box,
  HStack,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useBoolean,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

interface VolumeControlProps {
  volume: number;
  setVolume: (volume: number) => void;
  muted: boolean;
  setMuted: ReturnType<typeof useBoolean>[1];
}

const getVolumeIcon = (volume: number, muted: boolean): JSX.Element => {
  if (muted || volume === 0) {
    return <FaVolumeMute size="18px" />;
  }

  if (volume < 0.5) {
    return <FaVolumeDown size="18px" />;
  }

  return <FaVolumeUp size="18px" />;
};

const VolumeControl = ({
  volume,
  setVolume,
  muted,
  setMuted,
}: VolumeControlProps): JSX.Element => {
  const [isMouseOver, setIsMouseOver] = useBoolean(false);
  const [isChangingVolume, setIsChangingVolume] = useBoolean(false);

  const isShowingSlider = isMouseOver || isChangingVolume;

  const handleChange = useCallback(
    (value: number) => {
      setVolume(value / 100);
      setMuted.off();
    },
    [setVolume, setMuted],
  );

  const handleChangeStart = useCallback(() => {
    setIsChangingVolume.on();
  }, [setIsChangingVolume]);

  const handleChangeEnd = useCallback(() => {
    setIsChangingVolume.off();
  }, [setIsChangingVolume]);

  return (
    <HStack
      aligh="center"
      spacing={0}
      onMouseEnter={setIsMouseOver.on}
      onMouseLeave={setIsMouseOver.off}
    >
      <IconButton
        onClick={setMuted.toggle}
        variant="ghost"
        icon={getVolumeIcon(volume, muted)}
        aria-label="volume"
      />
      <motion.div
        style={{
          overflow: "hidden",
          width: "0",
        }}
        animate={isShowingSlider ? { width: "auto" } : { width: "0" }}
        transition={{ ease: "easeInOut", duration: 0.25 }}
      >
        <Box paddingX={3}>
          <Slider
            aria-label="volume"
            defaultValue={muted ? 0 : volume * 100}
            value={muted ? 0 : volume * 100}
            onChange={handleChange}
            onChangeStart={handleChangeStart}
            onChangeEnd={handleChangeEnd}
            focusThumbOnChange={false}
            width="100px"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb borderColor="gray.500" />
          </Slider>
        </Box>
      </motion.div>
    </HStack>
  );
};

export default VolumeControl;
