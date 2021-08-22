import { AspectRatio, HStack } from "@chakra-ui/react";

import Activities from "./Activities";
import MembersInfo from "./MembersInfo";

const RoomInfo = (): JSX.Element => (
  <AspectRatio ratio={2.8284} width="100%" flexGrow={1}>
    <HStack spacing={8}>
      <Activities />
      <MembersInfo />
    </HStack>
  </AspectRatio>
);

export default RoomInfo;
