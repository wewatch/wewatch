import {
  AspectRatio,
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaPlay, FaTrashAlt } from "react-icons/fa";

import OverflowText from "components/common/OverflowText";
import RequestUtil from "utils/api";

interface PlaylistItemProps {
  url: string;
}

interface NoembedInfo {
  title: string;
  thumbnail_url: string;
}

const PlaylistItem = ({ url }: PlaylistItemProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<NoembedInfo | null>(null);

  useEffect(() => {
    const getInfo = async () =>
      RequestUtil.get<NoembedInfo>(`https://noembed.com/embed?url=${url}`);

    getInfo().then((response) => {
      setInfo(response);
      setLoading(false);
    });
  }, [url]);

  if (loading || !info) {
    return <span>Loading</span>;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      paddingInlineEnd={1}
    >
      <HStack>
        <AspectRatio ratio={16 / 9} minW={24}>
          <Image src={info.thumbnail_url} alt={info.title} />
        </AspectRatio>
        <OverflowText fontSize="xs" noOfLines={3}>
          {info.title}
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
};

export default PlaylistItem;
