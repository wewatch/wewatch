import { AspectRatio, Box, HStack, Image } from "@chakra-ui/react";
import React from "react";

import type { VideoDTO } from "@wewatch/schemas";
import OverflowText from "components/common/OverflowText";

export type VideoDetailProps = VideoDTO;

interface VideoDetailWithControlProps extends VideoDetailProps {
  controller: (video: VideoDetailProps) => JSX.Element;
}

const VideoDetailWithControl = ({
  controller,
  ...video
}: VideoDetailWithControlProps): JSX.Element => (
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
