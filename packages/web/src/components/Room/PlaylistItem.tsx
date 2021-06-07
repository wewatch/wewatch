import {
  AspectRatio,
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { FaPlay, FaTrashAlt } from "react-icons/fa";

import { VideoDTO } from "@wewatch/schemas";
import OverflowText from "components/common/OverflowText";

interface PlaylistItemProps {
  video: VideoDTO;
}

const PlaylistItem = ({ video }: PlaylistItemProps): JSX.Element => (
  <Box
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    paddingInlineEnd={1}
  >
    <HStack>
      <AspectRatio ratio={16 / 9} minW={24}>
        <Image src={video.thumbnailUrl} alt={video.title} />
      </AspectRatio>
      <OverflowText fontSize="xs" noOfLines={3}>
        {video.title}
      </OverflowText>
      <VStack spacing={0}>
        <IconButton
          aria-label="hello"
          icon={<Icon as={FaPlay} />}
          size="xs"
          variant="ghost"
          isRound
        />
        <IconButton
          aria-label="hello"
          icon={<Icon as={FaTrashAlt} />}
          size="xs"
          variant="ghost"
          isRound
        />
      </VStack>
    </HStack>
  </Box>
);

export default PlaylistItem;
