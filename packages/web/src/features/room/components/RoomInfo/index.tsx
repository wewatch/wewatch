import { AspectRatio, HStack } from "@chakra-ui/react";

import Activities from "./Activities";
import MembersInfo from "./MembersInfo";

const RoomInfo = (): JSX.Element => (
  <AspectRatio ratio={2.8284} width="100%">
    <HStack>
      <Activities />
      <MembersInfo />
    </HStack>
  </AspectRatio>
);

export default RoomInfo;
