import { AvatarBadge, Box, HStack, VStack } from "@chakra-ui/react";

import type { MemberDTO } from "@/schemas/member";
import UserAvatar from "components/UserAvatar";
import { useAuth } from "contexts/Auth";

interface MembersListProps {
  members: MemberDTO[];
}

const MembersList = ({ members }: MembersListProps): JSX.Element => {
  const { user } = useAuth();

  return (
    <VStack align="start">
      {members.map((m) => (
        <HStack key={m.user.id}>
          <UserAvatar
            {...m.user}
            badge={
              <AvatarBadge
                boxSize="1em"
                backgroundColor={m.online ? "green.500" : "gray.300"}
              />
            }
          />
          <Box>
            {m.user.id === user?.id ? `${m.user.name} (You)` : m.user.name}
          </Box>
        </HStack>
      ))}
    </VStack>
  );
};

export default MembersList;
