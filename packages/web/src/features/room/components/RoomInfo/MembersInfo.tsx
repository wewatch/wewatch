import { AvatarBadge, Box, Heading, HStack, VStack } from "@chakra-ui/react";

import UserAvatar from "components/UserAvatar";
import { useAuth } from "contexts/Auth";
import { useMembers } from "hooks/room";

const MembersInfo = (): JSX.Element => {
  const { user } = useAuth();
  const members = useMembers();
  const membersList = Object.values(members);

  // Current user should see themselves first on the list
  const orderedMembersList = membersList
    .filter((m) => m.user.id === user?.id)
    .concat(membersList.filter((m) => m.user.id !== user?.id));

  return (
    <VStack width="100%" height="100%" align="start">
      <Heading as="h2" size="md" paddingX={3}>
        Members
      </Heading>
      <Box
        width="100%"
        height="100%"
        borderWidth="1px"
        borderRadius="lg"
        padding={2}
        overflow="auto"
      >
        <VStack align="start">
          {orderedMembersList.map((m) => (
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
      </Box>
    </VStack>
  );
};

export default MembersInfo;
