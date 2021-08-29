import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";

import { UserInfoDTO } from "@/schemas/user";
import UserAvatar from "components/UserAvatar";

import UpdateUserInfo from "./UpdateUserInfo";

interface UserInfoProps {
  user: UserInfoDTO;
}

const UserInfo = ({ user }: UserInfoProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Menu autoSelect={false}>
      <MenuButton>
        <UserAvatar {...user} />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onOpen}>{user.name}</MenuItem>
        <UpdateUserInfo isOpen={isOpen} onClose={onClose} />
      </MenuList>
    </Menu>
  );
};

export default UserInfo;
