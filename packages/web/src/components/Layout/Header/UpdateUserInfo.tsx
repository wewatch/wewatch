import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import {
  UpdateUserInfoDTO,
  updateUserInfoSchema,
  UserInfoDTO,
} from "@/schemas/user";
import userApi from "api/user";
import { getErrorMessage } from "common/utils";
import { useAuth } from "contexts/Auth";
import useNotify from "hooks/notification";

interface UpdateUserInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateUserInfo = ({
  isOpen,
  onClose,
}: UpdateUserInfoProps): JSX.Element => {
  const notify = useNotify();
  const { user, setUser } = useAuth();

  const getDefaultValues = (user_: UserInfoDTO | null): UpdateUserInfoDTO => ({
    name: user_?.name ?? "",
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting, errors },
  } = useForm<UpdateUserInfoDTO>({
    resolver: yupResolver(updateUserInfoSchema),
    defaultValues: getDefaultValues(user),
  });

  const [triggerUpdateUserInfo] =
    userApi.endpoints.updateUserInfo.useMutation();

  const onSubmit = async (payload: UpdateUserInfoDTO): Promise<void> => {
    const result = await triggerUpdateUserInfo(payload);

    if ("data" in result) {
      setUser(result.data);
      reset(getDefaultValues(result.data));
      notify({
        status: "success",
        title: "Profile updated successfully",
      });
    }

    if ("error" in result) {
      notify({
        status: "error",
        title: "Cannot update profile",
        description: getErrorMessage(result.error),
      });
      reset();
    }

    onClose();
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Profile</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl id="name" isInvalid={!!errors.name} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                {...register("name")}
                placeholder="Name"
                autoComplete="off"
              />
              <FormErrorMessage marginTop={0}>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              ml={4}
              isDisabled={!isDirty}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UpdateUserInfo;
