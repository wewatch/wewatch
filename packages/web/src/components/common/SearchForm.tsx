import {
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, FormikProps, withFormik } from "formik";
import React, { MutableRefObject } from "react";
import { FaSearch } from "react-icons/fa";

import { SearchDTO, searchSchema } from "@wewatch/schemas";

interface InnerFormProps {
  inputRef: MutableRefObject<null>;
}

const InnerForm = (props: InnerFormProps & FormikProps<SearchDTO>) => {
  const { touched, errors, isSubmitting, inputRef } = props;

  return (
    <Form>
      <Field name="q">
        {({ field }: FieldProps) => (
          <FormControl isInvalid={!!(errors.q && touched.q)}>
            <InputGroup>
              <Input placeholder="search" {...field} ref={inputRef} />
              <InputRightAddon>
                <IconButton
                  icon={<FaSearch />}
                  aria-label="search videos"
                  isLoading={isSubmitting}
                  type="submit"
                />
              </InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.q}</FormErrorMessage>
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
    q: "",
  }),

  validationSchema: searchSchema,

  handleSubmit: async (values, { props: { search } }) => {
    await search(values);
  },
})(InnerForm);

export default SearchForm;
