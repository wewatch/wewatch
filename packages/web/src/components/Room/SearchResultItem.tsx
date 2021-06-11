import { IconButton, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa";

import type { VideoDetailProps } from "./VideoDetailWithControl";
import VideoDetailWithControl from "./VideoDetailWithControl";

const SearchResultItemController = ({
  title,
}: VideoDetailProps): JSX.Element => {
  const handleAdd = () => {
    console.log(`Add ${title}`);
  };

  return (
    <VStack spacing={0}>
      <IconButton
        aria-label="hello"
        icon={<FaPlus />}
        size="xs"
        variant="ghost"
        isRound
        onClick={handleAdd}
      />
    </VStack>
  );
};

const SearchResultItem = (props: VideoDetailProps): JSX.Element => (
  <VideoDetailWithControl {...props} controller={SearchResultItemController} />
);

export default SearchResultItem;
