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
import { Field, FieldProps, Form, FormikProps, withFormik } from "formik";
import { MutableRefObject, useEffect, useRef } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import { SearchDTO, searchSchema } from "@/schemas/search";
import roomApi from "api/room";
import { getErrorMessage } from "common/utils";
import useNotify from "hooks/notification";

import SearchResultItem from "./SearchResultItem";

interface InnerFormProps {
  inputRef: MutableRefObject<null>;
  isLoading: boolean;
}

const InnerForm = (props: InnerFormProps & FormikProps<SearchDTO>) => {
  const { touched, errors, inputRef, isLoading } = props;

  return (
    <Form>
      <Field name="query">
        {({ field }: FieldProps) => (
          <FormControl isInvalid={!!(errors.query && touched.query)}>
            <InputGroup>
              <Input placeholder="search" {...field} ref={inputRef} />
              <InputRightAddon paddingX={0}>
                <IconButton
                  icon={<FaSearch />}
                  aria-label="search videos"
                  isLoading={isLoading}
                  type="submit"
                  variant="ghost"
                />
              </InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.query}</FormErrorMessage>
          </FormControl>
        )}
      </Field>
    </Form>
  );
};

interface SearchFormProps extends InnerFormProps {
  search: (values: SearchDTO) => Promise<unknown>;
}

const SearchForm = withFormik<SearchFormProps, SearchDTO>({
  mapPropsToValues: () => ({
    query: "",
  }),

  validationSchema: searchSchema,

  handleSubmit: async (values, { props: { search } }) => {
    await search(values);
  },
})(InnerForm);

const SearchBox = (): JSX.Element => {
  const inputRef = useRef(null);
  const [triggerSearchVideo, { data, error, isLoading }] =
    roomApi.endpoints.searchVideo.useMutation();
  const notify = useNotify();

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
        <PopoverHeader paddingRight={10}>
          <SearchForm
            search={triggerSearchVideo}
            isLoading={isLoading}
            inputRef={inputRef}
          />
        </PopoverHeader>
        <PopoverBody overflow="auto">
          <VStack>
            {(data ?? []).map((video) => (
              <SearchResultItem video={video} key={video.url} />
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBox;
