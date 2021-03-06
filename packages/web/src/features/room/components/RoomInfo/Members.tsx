import { Box, Heading, VStack } from "@chakra-ui/react";
import { skipToken } from "@reduxjs/toolkit/query";

import roomApi from "api/room";
import ItemsSkeleton from "components/ItemsSkeleton";
import { useAuth } from "contexts/Auth";
import { useMembers, useRoomId } from "hooks/room";

import MemberDetail from "./MemberDetail";

const Members = (): JSX.Element => {
  const { user } = useAuth();
  const members = useMembers();
  const membersList = Object.values(members);

  // Current user should see themselves first on the list
  const orderedMembersList = membersList
    .filter((m) => m.user.id === user?.id)
    .concat(membersList.filter((m) => m.user.id !== user?.id));

  const roomId = useRoomId();
  const { isLoading } = roomApi.endpoints.getRoomMembers.useQuery(
    roomId ?? skipToken,
  );

  return (
    <VStack width="100%" height="100%" align="start">
      <Heading as="h2" size="md" paddingX={3}>
        Members
      </Heading>
      <Box width="100%" height="100%" padding={2} overflow="auto">
        {isLoading ? (
          <ItemsSkeleton height="36px" />
        ) : (
          <VStack align="start">
            {orderedMembersList.map((member) => (
              <MemberDetail
                key={member.user.id}
                member={member}
                isSelf={member.user.id === user?.id}
              />
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default Members;
