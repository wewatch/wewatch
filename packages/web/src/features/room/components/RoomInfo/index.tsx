import { AspectRatio, HStack } from "@chakra-ui/react";

import ActionsLog from "./ActionsLog";
import MembersInfo from "./MembersInfo";

const RoomInfo = (): JSX.Element => (
  <AspectRatio ratio={2.8284} width="100%">
    <HStack>
      <ActionsLog />
      <MembersInfo />
    </HStack>
  </AspectRatio>
);

export default RoomInfo;
