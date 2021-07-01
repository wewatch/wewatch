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
import { nanoid } from "nanoid";
import React, { MutableRefObject, useCallback, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import {
  SearchDTO,
  searchSchema,
  SearchVideoResultDTO,
} from "@wewatch/common/schemas/search";
import RequestUtil from "common/api";
import useNotify from "common/hooks/notification";

import SearchResultItem from "./SearchResultItem";

interface InnerFormProps {
  inputRef: MutableRefObject<null>;
}

const InnerForm = (props: InnerFormProps & FormikProps<SearchDTO>) => {
  const { touched, errors, isSubmitting, inputRef } = props;

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
                  isLoading={isSubmitting}
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
  search: (values: SearchDTO) => Promise<void>;
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
  const inputRef = React.useRef(null);
  const [searchResult, setSearchResult] = useState<SearchVideoResultDTO>([]);
  const notify = useNotify();

  const search = useCallback(
    async (values: SearchDTO) => {
      try {
        const result: SearchVideoResultDTO = await RequestUtil.post(
          "/search",
          values,
        );
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
              <SearchResultItem {...video} id={nanoid()} key={video.url} />
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBox;
