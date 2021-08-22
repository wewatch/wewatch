import { Box, Heading, VStack } from "@chakra-ui/react";

const ActionsLog = (): JSX.Element => (
  <VStack width="100%" height="100%" align="start">
    <Heading as="h2" size="md" paddingX={3}>
      ActionsLog
    </Heading>
    <Box
      width="100%"
      height="100%"
      borderWidth="1px"
      borderRadius="lg"
      padding={2}
      overflow="auto"
    >
      ActionsLog
    </Box>
  </VStack>
);

export default ActionsLog;
