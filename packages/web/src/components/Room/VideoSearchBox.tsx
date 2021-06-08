import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { FaPlus } from "react-icons/fa";

import { SearchDTO, SearchVideoResultDTO } from "@wewatch/schemas";
import SearchForm from "components/common/SearchForm";
import useNotify from "hooks/notification";
import RequestUtil from "utils/api";

import PlaylistItem from "./PlaylistItem";

const VideoSearchBox = (): JSX.Element => {
  const inputRef = React.useRef(null);
  const [searchResult, setSearchResult] = useState<SearchVideoResultDTO>([]);
  const notify = useNotify();

  const search = useCallback(
    async (values: SearchDTO) => {
      try {
        const result = await RequestUtil.post<SearchVideoResultDTO>("/search", {
          ...values,
        });
        setSearchResult(result);
      } catch (e) {
        notify({
          status: "error",
          title: "Cannot search at the moment",
          description: e.message,
        });
      }
    },
    [notify],
  );

  return (
    <Popover initialFocusRef={inputRef}>
      <PopoverTrigger>
        <IconButton aria-label="add to playlist" icon={<FaPlus />} />
      </PopoverTrigger>
      <PopoverContent maxHeight="50vh">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader paddingRight={10}>
          <SearchForm search={search} inputRef={inputRef} />
        </PopoverHeader>
        <PopoverBody overflow="auto">
          <VStack>
            {searchResult.map((video) => (
              <PlaylistItem video={video} key={video.url} />
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default VideoSearchBox;
