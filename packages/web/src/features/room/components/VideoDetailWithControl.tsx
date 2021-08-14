import { AspectRatio, Box, HStack, Image } from "@chakra-ui/react";
import React from "react";

import type { NewVideoDTO } from "@/schemas/room";
import OverflowText from "components/OverflowText";
import { usePlayerState } from "hooks/room";

interface VideoDetailWithControlProps<T extends NewVideoDTO> {
  video: T;
  controller: (video: T) => React.ReactNode;
}

const VideoDetailWithControl = <T extends NewVideoDTO = NewVideoDTO>({
  video,
  controller,
}: VideoDetailWithControlProps<T>): JSX.Element => {
  const { url: activeURL } = usePlayerState();
  const isActiveUrl = video.url === activeURL;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={isActiveUrl ? "blue.500" : undefined}
      backgroundColor={isActiveUrl ? "blue.50" : "white"}
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
