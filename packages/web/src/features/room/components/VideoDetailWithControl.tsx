import { AspectRatio, Box, HStack, Image } from "@chakra-ui/react";
import React from "react";

import type { VideoDTO } from "@wewatch/schemas";
import OverflowText from "common/components/OverflowText";

interface VideoDetailWithControlProps<T> {
  video: T;
  controller: (video: T) => React.ReactNode;
}

const VideoDetailWithControl = <T extends VideoDTO>({
  video,
  controller,
}: VideoDetailWithControlProps<T>): JSX.Element => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
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

export default VideoDetailWithControl;
