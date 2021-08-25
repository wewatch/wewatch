import { AspectRatio, HStack } from "@chakra-ui/react";

import Activities from "./Activities";
import Members from "./Members";

const RoomInfo = (): JSX.Element => (
  <AspectRatio ratio={2.8284} width="100%" flexGrow={1}>
    <HStack spacing={8}>
      <Activities />
      <Members />
    </HStack>
  </AspectRatio>
);

export default RoomInfo;
