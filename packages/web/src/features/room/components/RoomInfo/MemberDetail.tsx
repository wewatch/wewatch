import { AvatarBadge, Box, HStack, Spacer } from "@chakra-ui/react";

import type { MemberDTO } from "@/schemas/member";
import UserAvatar from "components/UserAvatar";

import NetworkStatus from "./NetworkStatus";

interface PeerDetailProps {
  member: MemberDTO;
  isSelf: boolean;
}

const MemberDetail = ({
  member: { user, online },
  isSelf,
}: PeerDetailProps): JSX.Element => (
  <HStack width="100%">
    <UserAvatar
      {...user}
      badge={
        <AvatarBadge
          boxSize="1em"
          backgroundColor={online ? "green.500" : "gray.300"}
        />
      }
    />
    <Box>{isSelf ? `${user.name} (You)` : user.name}</Box>
    {isSelf ? (
      <>
        <Spacer />
        <NetworkStatus />
      </>
    ) : null}
  </HStack>
);

export default MemberDetail;
