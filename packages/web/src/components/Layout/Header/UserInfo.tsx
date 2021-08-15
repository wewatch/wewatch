import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

import { UserInfoDTO } from "@/schemas/user";

interface UserInfoProps {
  user: UserInfoDTO;
}

const UserInfo = ({ user }: UserInfoProps): JSX.Element => (
  <Menu autoSelect={false}>
    <MenuButton>
      <Avatar
        showBorder
        name={user.name}
        src={`https://robohash.org/${user.id}.png?set=set4&bgset=bg1&size=48x48`}
        size="sm"
      />
    </MenuButton>
    <MenuList>
      <MenuItem>{user.name}</MenuItem>
    </MenuList>
  </Menu>
);

export default UserInfo;
