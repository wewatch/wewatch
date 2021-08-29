import {
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaSearch } from "react-icons/fa";

import { SearchDTO, searchSchema } from "@/schemas/search";
import roomApi from "api/room";
import { getErrorMessage } from "common/utils";
import useNotify from "hooks/notification";

import SearchResultItem from "./SearchResultItem";

const SearchBox = (): JSX.Element => {
  const inputRef = useRef(null);
  const [triggerSearchVideo, { data, error }] =
    roomApi.endpoints.searchVideo.useMutation();
  const notify = useNotify();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SearchDTO>({
    resolver: yupResolver(searchSchema),
    defaultValues: {
      query: "",
    },
  });

  const showPopoverBody = data !== undefined;

  useEffect(() => {
    if (error) {
      notify({
        status: "error",
        title: "Cannot search at the moment",
        description: getErrorMessage(error),
      });
    }
  }, [notify, error]);

  return (
    <Popover initialFocusRef={inputRef}>
      <PopoverTrigger>
        <IconButton aria-label="add to playlist" icon={<FaPlus />} />
      </PopoverTrigger>
      <PopoverContent maxHeight="50vh" boxShadow="dark-lg">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader
          paddingRight={10}
          borderBottomStyle={showPopoverBody ? "solid" : "hidden"}
        >
          <form onSubmit={handleSubmit(triggerSearchVideo)}>
            <FormControl isInvalid={!!errors.query}>
              <InputGroup>
                <Input
                  {...register("query")}
                  ref={inputRef}
                  placeholder="search"
                />
                <InputRightAddon paddingX={0}>
                  <IconButton
                    icon={<FaSearch />}
                    aria-label="search videos"
                    isLoading={isSubmitting}
                    type="submit"
                    variant="ghost"
                  />
                </InputRightAddon>
              </InputGroup>
              <FormErrorMessage marginTop={0}>
                {errors.query?.message}
              </FormErrorMessage>
            </FormControl>
          </form>
        </PopoverHeader>
        {showPopoverBody && (
          <PopoverBody overflow="auto">
            {data?.length ? (
              <VStack>
                {data.map((video) => (
                  <SearchResultItem video={video} key={video.url} />
                ))}
              </VStack>
            ) : (
              "No results"
            )}
          </PopoverBody>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default SearchBox;
