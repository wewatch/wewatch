import { Avatar } from "@chakra-ui/react";

import { UserInfoDTO } from "@/schemas/user";

interface UserAvatarProps extends UserInfoDTO {
  badge?: JSX.Element;
}

const UserAvatar = ({ name, id, badge }: UserAvatarProps): JSX.Element => (
  <Avatar
    showBorder
    name={name}
    src={`https://robohash.org/${id}.png?set=set4&bgset=bg1&size=48x48`}
    size="sm"
  >
    {badge ?? null}
  </Avatar>
);

UserAvatar.defaultProps = {
  badge: undefined,
};

export default UserAvatar;
