import { Box, Heading, VStack } from "@chakra-ui/react";

import { useAppSelector } from "hooks/redux";

import ActivityDetail from "./ActivityDetail";

const Activities = (): JSX.Element => {
  const activities = useAppSelector((state) => state.activities);

  return (
    <VStack width="100%" height="100%" align="start">
      <Heading as="h2" size="md" paddingX={3}>
        Activities
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
          {activities.map((activity) => (
            <ActivityDetail
              {...activity}
              key={`${activity.timestamp}-${activity.userId}`}
            />
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default Activities;
