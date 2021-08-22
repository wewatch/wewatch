import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { UserInfoDTO } from "@/schemas/user";
import UserAvatar from "components/UserAvatar";

interface UserInfoProps {
  user: UserInfoDTO;
}

const UserInfo = ({ user }: UserInfoProps): JSX.Element => (
  <Menu autoSelect={false}>
    <MenuButton>
      <UserAvatar {...user} />
    </MenuButton>
    <MenuList>
      <MenuItem>{user.name}</MenuItem>
    </MenuList>
  </Menu>
);

export default UserInfo;
