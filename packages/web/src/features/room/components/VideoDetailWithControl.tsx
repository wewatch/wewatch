import { AspectRatio, Box, HStack, Image } from "@chakra-ui/react";
import React from "react";

import type { VideoDTO } from "@/schemas/room";
import OverflowText from "common/components/OverflowText";
import { usePlayerState } from "common/hooks/selector";

interface VideoDetailWithControlProps {
  video: VideoDTO;
  controller: (video: VideoDTO) => React.ReactNode;
}

const VideoDetailWithControl = ({
  video,
  controller,
}: VideoDetailWithControlProps): JSX.Element => {
  const { url: activeURL } = usePlayerState();
  const isActiveUrl = video.url === activeURL;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={isActiveUrl ? "blue.500" : undefined}
      backgroundColor={isActiveUrl ? "gray.50" : undefined}
      overflow="hidden"
      paddingInlineEnd={1}
      width="100%"
    >
      <HStack>
        <AspectRatio ratio={16 / 9} minW={24}>
          <Image src={video.thumbnailUrl} alt={video.title} />
        </AspectRatio>
        <OverflowText fontSize="xs" noOfLines={3} flexGrow={1}>
          {video.title}
        </OverflowText>
        {controller(video)}
      </HStack>
    </Box>
  );
};

export default VideoDetailWithControl;
