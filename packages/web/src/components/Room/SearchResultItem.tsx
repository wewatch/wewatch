import { IconButton, VStack } from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa";

import { NonPersistedVideoDTO } from "@wewatch/schemas";

import VideoDetailWithControl from "./VideoDetailWithControl";

const SearchResultItemController = ({
  title,
}: NonPersistedVideoDTO): JSX.Element => {
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

const SearchResultItem = (video: NonPersistedVideoDTO): JSX.Element => (
  <VideoDetailWithControl
    video={video}
    controller={SearchResultItemController}
  />
);

export default SearchResultItem;
